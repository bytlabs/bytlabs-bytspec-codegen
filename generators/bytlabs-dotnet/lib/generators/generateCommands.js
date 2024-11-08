import { pascalCase } from "change-case";
import path from "path"
import {
    getClassTemplateData,
    parseTemplateWithPath
} from "../shared.js"
import unwrapObj from "../utils/unwrapObj.js";
import { TEMPLATE_PATH } from "../constants.js"
import typeResolver from "./../resolvers/typeResolver.js";
import defaultValueResolver from "./../resolvers/defaultValueResolver.js";
import lodash from "lodash";
import methodOpResolver from "../resolvers/methodOpResolver.js";

const resolveInlineClasses = (field, boundedContext, classNamePrefix, classes = []) => {

    if(field.hasPropertiesOf) {
        let inlineClass =  boundedContext;
        const breadcrumbs = field.hasPropertiesOf.split("/").slice(1);
        for(let breadcrumb of breadcrumbs) {
            inlineClass = inlineClass[breadcrumb];
            inlineClass.name = classNamePrefix + "_" + field.name;
        }

        if(field.except) {
            inlineClass.properties = lodash.omit(inlineClass.properties, field.except)
        }

        if(field.with) {
            const otherClasses = lodash.flatMap(unwrapObj(field.with), childField=> resolveInlineClasses(childField, boundedContext, inlineClass.name))
            classes = [...classes, ...otherClasses]
            
        }

        return [...classes, getClassTemplateData(inlineClass, boundedContext)]
       
    }

    return classes;
}


const getCommandData = (command, boundedContext) => {
    const projectName = pascalCase(boundedContext.name);
    const className = pascalCase(command.name);



    const fields = unwrapObj(command.input)
        .map(field => {

            let type = null;
            let subTypes;

            if(field.hasPropertiesOf) {
                subTypes = resolveInlineClasses(field, boundedContext, command.name)
                type = lodash.last(subTypes).class.name;
            }
            else {
                type = typeResolver(field.type, field.items)
            }

            return {
                type: type,
                name: pascalCase(field.name),
                default: defaultValueResolver(type),
                subTypes: subTypes || []
            }
        })

        let returnType = null;

        if(command.returns) {
            returnType = typeResolver(command.returns);
        }

    const body = command.execute.map(line => methodOpResolver(line, boundedContext, { executionContext: command }))
    let deps = [{ type: "IUserContextProvider", name: "userContextProvider"}]
    const repoDeps = command.execute
                            .filter(op=> op.aggregate || (op.let && op.let.aggregate))
                            .map(op=> op.aggregate? op.aggregate.type : op.let.aggregate.type)
                            .map(type=> ({ type: `IRepository<${typeResolver(type)}, string>`, name: `${lodash.camelCase(typeResolver(type))}Repository`})) || []
    deps = [...deps, ...repoDeps]

    return {
        project: {
            name: projectName
        },
        command: {
            name: className,
            fields: fields,
            subTypes: lodash.flatMap(fields, field=>field.subTypes),
            returnType: returnType,
            body: body,
            deps: deps
        }
    };
};


const generateCommands = async (spec, buildDirectory) => {

    const sourceDirectory = TEMPLATE_PATH;

    for (let boundedContext of unwrapObj(spec.boundedContexts)) {

        const templatesData = unwrapObj(boundedContext.application.commands)
            .map(command => getCommandData(command, boundedContext))

        for (let templateData of templatesData) {
            const destinationDirectory = path.join(buildDirectory, templateData.project.name);
            await parseTemplateWithPath(sourceDirectory, destinationDirectory, "Command.cs", templateData);
        }
    }
}

export default generateCommands;