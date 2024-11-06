import { pascalCase } from "change-case";
import path from "path"
import {
    getClassTemplateData,
    parseTemplateWithPath
} from "../shared.js"
import unwrapObj from "../utils/unwrapObj.js";
import { TEMPLATE_PATH } from "../constants.js"





const generateDomainModels = async (spec, buildDirectory) => {

    const sourceDirectory = TEMPLATE_PATH;

    for (let boundedContext of unwrapObj(spec.boundedContexts)) {

        const templatesData = unwrapObj(boundedContext.domain.entities)
            .map(entity => getClassTemplateData(entity, boundedContext))

        for (let templateData of templatesData) {
            const destinationDirectory = path.join(buildDirectory, templateData.project.name);
            await parseTemplateWithPath(sourceDirectory, destinationDirectory, ".entity.cs", templateData);
        }
    }
}

export default generateDomainModels;