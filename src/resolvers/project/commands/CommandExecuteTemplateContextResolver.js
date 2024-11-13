import { ExecutionArgs, Provider } from "../../def.js";

/**
* Description placeholder
*/
class CommandExecuteTemplateContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandExecuteTemplateContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {CommandExecuteExecutionArgs} param
    * @returns {Promise<string[]>}
    * 
    */
    async execute({ context, ...options }) {
        return await Promise.all(context.map(async op => await this.provider.opSchemaResolver.execute({ context: op, ...options })))
    }
}

export default CommandExecuteTemplateContextResolver

/**
* Description placeholder
*/
export class CommandExecuteExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {Object[]}
     */
    context
}