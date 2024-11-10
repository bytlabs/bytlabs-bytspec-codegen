import { pascalCase } from "change-case";
import path from "path"
import {
    getClassTemplateData,
    parseTemplateWithPath
} from "../shared.js"
import unwrapObj from "../utils/unwrapObj.js";
import { TEMPLATE_PATH } from "../constants.js"



const getClassTemplateData = (entity, boundedContext, { isEntity } = {}) => {
    const projectName = pascalCase(boundedContext.name);
    const className = pascalCase(entity.name);

    const fields = unwrapObj(entity.properties || {})
        .map(field => ({
            type: typeResolver(field.type, field.items),
            name: pascalCase(field.name),
            default: defaultValueResolver(field.type, field.items)
        }))

    let methods = [];

    if (entity.actions) {
        methods = unwrapObj(entity.actions)
            .map(method => ({
                name: pascalCase(method.name),
                type: "void",
                parameters: unwrapObj(method.parameters).map(param => ({ name: param.name, type: typeResolver(param.type) })),
                body: method.execute.map(line => methodOpResolver(line, boundedContext, { executionContext: entity }))
            }))
    }

    return {
        project: {
            name: projectName
        },
        class: {
            name: className,
            fields: isEntity ? fields.filter(x => x.name != "Id") : fields,
            methods: methods,
            aggregate: entity.aggregate,
            idType: isEntity ? fields.find(x => x.name == "Id")?.type : null
        }
    };
}

export default function () {
    return {
        execute: async (spec, buildDirectory) => {

            const sourceDirectory = TEMPLATE_PATH;

            for (let boundedContext of unwrapObj(spec.boundedContexts)) {

                const templatesData = unwrapObj(boundedContext.domain.entities)
                    .map(entity => getClassTemplateData(entity, boundedContext, { isEntity: true }))

                for (let templateData of templatesData) {
                    const destinationDirectory = path.join(buildDirectory, templateData.project.name);
                    await parseTemplateWithPath(sourceDirectory, destinationDirectory, ".entity.cs", templateData);
                }
            }
        }
    }
};