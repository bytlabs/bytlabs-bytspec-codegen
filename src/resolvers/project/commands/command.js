import { pascalCase } from "change-case";
import { Builder } from "builder-pattern";
import { CommandSubTypesArgs } from "./commandSubTypes.js";

export default function (provider) {
    return {
        execute: async ({ context, boundedContext }) => {
            const projectName = pascalCase(boundedContext.name);
            const className = pascalCase(context.name);



            const fields = await Promise.all(unwrapObj(context.input)
                .map(async field => {

                    let type = null;
                    let subTypes = [];

                    if (field.hasPropertiesOf) {

                        const args = Builder(CommandSubTypesArgs)
                            .field(field)
                            .boundedContext(boundedContext)
                            .classNamePrefix(context.name)
                            .classes([])
                            .build();

                        subTypes = await provider.projectcontextSubTypesResolver.execute(args)

                        type = _.last(subTypes).class.name;
                    }
                    else {
                        type = await provider.schemaTypeResolver.execute({ context: { type: field.type, items: field.items } })
                    }

                    return {
                        type: type,
                        name: pascalCase(field.name),
                        default: await provider.schemaDefaultValueResolver.execute({ context: { type } }),
                        subTypes: subTypes
                    }
                }))

            const returnType = context.returns ? await provider.schemaTypeResolver.execute({ context: context.returns, boundedContext }) : null;

            const body = await Promise.all( context.execute.map(async line => await provider.schemaOpResolver.execute({ context: line, boundedContext, context })))

            const deps = [{ type: "IUserContextProvider", name: "userContextProvider" }].concat(
                await Promise.all(context.execute
                    .filter(op => op.aggregate || (op.let && op.let.aggregate))
                    .map(op => op.aggregate ? op.aggregate.type : op.let.aggregate.type)
                    .map(async type => ({ type: `IRepository<${await provider.schemaTypeResolver.execute(type)}, string>`, name: `${_.camelCase(await provider.schemaTypeResolver.execute(type))}Repository` }))));


            const subTypes = _.flatMap(fields, field => field.subTypes);

            return {
                project: {
                    name: projectName
                },
                context: {
                    name: className,
                    fields: fields,
                    subTypes: subTypes,
                    returnType: returnType,
                    body: body,
                    deps: deps
                }
            };
        }
    }
}
