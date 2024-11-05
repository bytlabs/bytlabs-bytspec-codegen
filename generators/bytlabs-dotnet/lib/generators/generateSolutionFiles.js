import path from "path";
import { pascalCase } from "change-case";
import { TEMPLATE_PATH } from "../constants.js"
import { parseTemplateWithPath } from "../shared.js"

const generateSolutionFiles = async (spec, buildDirectory) => {
    const sourceDirectory = TEMPLATE_PATH;
    const boundedContextNames = Object.keys(spec.boundedContexts);
    for (let boundedContextName of boundedContextNames) {
        const projectName = pascalCase(boundedContextName);
        const templateData = {
            project: {
                name: projectName
            }
        };
        const destinationDirectory = path.join(buildDirectory, projectName);
        await parseTemplateWithPath(sourceDirectory, destinationDirectory, ".sln", templateData);
        await parseTemplateWithPath(sourceDirectory, destinationDirectory, ".csproj", templateData);
        await parseTemplateWithPath(sourceDirectory, destinationDirectory, "Dockerfile", templateData);
        await parseTemplateWithPath(sourceDirectory, destinationDirectory, "launch.json", templateData);
        await parseTemplateWithPath(sourceDirectory, destinationDirectory, "extensions.json", templateData);
    }
};

export default generateSolutionFiles;