
import path from "path"
import _ from "lodash";
import unwrapObj from "../../../utils/unwrapObj.js";
import { ExecutionArgs, FileResolverArgs, Provider } from "../../def.js";
import parseTemplateWithPath from "../../../utils/parseTemplateWithPath.js";

/**
* Description placeholder
*/
class CommandFileResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandFileResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {FileResolverArgs} param
    * @returns {Promise}
    * 
    */
    async execute({ spec, outputDirectory }) {

        const sourceDirectory = this.provider.projectTemplate;

        for (let boundedContext of unwrapObj(spec.boundedContexts)) {

            const commandContexts = await Promise.all(unwrapObj(boundedContext.application.commands)
                .map(async command => await this.provider.commandTemplateContextResolver.execute({ context: command, boundedContext, command, domainObject: null  })))

            for (let commandContext of commandContexts) {
                const destinationDirectory = path.join(outputDirectory, commandContext.project.name);
                await parseTemplateWithPath(sourceDirectory, destinationDirectory, "Command.cs", commandContext);
            }
        }
    }
}

export default CommandFileResolver

