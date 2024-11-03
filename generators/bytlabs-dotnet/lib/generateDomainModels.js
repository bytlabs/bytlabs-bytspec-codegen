import { pascalCase } from "change-case";
import path from "path"
import { parseTemplateWithPath, 
    resolveExtendedFields, 
    unwrapObj,
    mapToCsharpField } from "./shared.js"
import { TEMPLATE_PATH } from "./constants.js"


const generateDomainModels = async (spec, buildDirectory) => {
    const sourceDirectory = TEMPLATE_PATH;
    const boundedContextNames = Object.keys(spec.boundedContexts);
    for (let boundedContextName of boundedContextNames) {
        const core = spec.boundedContexts[boundedContextName].core;
        if (core.entities) {
            for (let entityName of Object.keys(core.entities)) {
                const projectName = pascalCase(boundedContextName);
                const className = pascalCase(entityName);
                const fields = unwrapObj(resolveExtendedFields(core.entities[entityName], spec.boundedContexts[boundedContextName]))
                        .map(field=> mapToCsharpField(field))
                const templateData = {
                    project: {
                        name: projectName
                    },
                    class: {
                        name: className,
                        fields: fields
                    }
                };
                const destinationDirectory = path.join(buildDirectory, projectName);
                await parseTemplateWithPath(sourceDirectory, destinationDirectory, ".entity.cs", templateData);
            }
        }
    }
}

export default generateDomainModels;