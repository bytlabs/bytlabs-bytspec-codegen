
import path from "path"
import _ from "lodash";
import parseTemplateWithPath from "../../../utils/parseTemplateWithPath";

export default function (provider) {
    return {
        execute: async (spec, buildDirectory) => {

            const sourceDirectory = opts.projectTemplate;

            for (let boundedContext of unwrapObj(spec.boundedContexts)) {

                const commandContexts = Promise.all(unwrapObj(boundedContext.application.commands)
                    .map(async command => await provider.projectCommandResolver.execute({ context: command, boundedContext })))

                for (let commandContext of commandContexts) {
                    const destinationDirectory = path.join(buildDirectory, commandContext.project.name);
                    await parseTemplateWithPath(sourceDirectory, destinationDirectory, "Command.cs", commandContext);
                }
            }
        }
    }
};