import { pascalCase } from "change-case";
import path from "path"
import { parseTemplateWithPath } from "../shared.js"
import unwrapObj from "../utils/unwrapObj.js";
import { TEMPLATE_PATH } from "../constants.js"
import _ from "lodash";
import { Builder } from "builder-pattern";






const commandContext = async ({ command, boundedContext, opts }) => {
    const projectName = pascalCase(boundedContext.name);
    const className = pascalCase(command.name);



    const fields = await Promise.all(unwrapObj(command.input)
        .map(async field => {

            let type = null;
            let subTypes;

            if (field.hasPropertiesOf) {

                const args = Builder(CommandInputSubTypesArgs)
                    .field(field)
                    .boundedContext(boundedContext)
                    .classNamePrefix(command.name)
                    .classes([])
                    .opts(opts)
                    .build();

                subTypes = opts.commandInputSubTypesContextBuilder(args) || []

                type = _.last(subTypes).class.name;
            }
            else {
                type = await opts.typeResolver.execute({ context: { type: field.type, items: field.items } })
            }

            return {
                type: type,
                name: pascalCase(field.name),
                default: await opts.defaultValueResolver.execute({ context: { type } }),
                subTypes: subTypes
            }
        }))

    let returnType = null;

    if (command.returns) {
        returnType = await opts.typeResolver.execute({ context: command.returns, boundedContext });
    }

    const body = command.execute.map(line => methodOpResolver(line, boundedContext, { executionContext: command }))
    let deps = [{ type: "IUserContextProvider", name: "userContextProvider" }]
    const repoDeps = command.execute
        .filter(op => op.aggregate || (op.let && op.let.aggregate))
        .map(op => op.aggregate ? op.aggregate.type : op.let.aggregate.type)
        .map(type => ({ type: `IRepository<${typeResolver(type)}, string>`, name: `${_.camelCase(typeResolver(type))}Repository` })) || []
    deps = [...deps, ...repoDeps]

    return {
        project: {
            name: projectName
        },
        command: {
            name: className,
            fields: fields,
            subTypes: _.flatMap(fields, field => field.subTypes),
            returnType: returnType,
            body: body,
            deps: deps
        }
    };
};


export default function () {
    return {
        execute: async (spec, buildDirectory) => {

            const sourceDirectory = TEMPLATE_PATH;

            for (let boundedContext of unwrapObj(spec.boundedContexts)) {

                const templatesData = Promise.all(unwrapObj(boundedContext.application.commands)
                    .map(async command => await commandContext(command, boundedContext)))

                for (let templateData of templatesData) {
                    const destinationDirectory = path.join(buildDirectory, templateData.project.name);
                    await parseTemplateWithPath(sourceDirectory, destinationDirectory, "Command.cs", templateData);
                }
            }
        }
    }
};