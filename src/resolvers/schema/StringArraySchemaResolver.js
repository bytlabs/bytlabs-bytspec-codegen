import { ExecutionArgs } from "../../def/executionArgs.js";
import { Provider } from "../../def/provider.js";


/**
* Description placeholder
*/
class StringArraySchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of StringArraySchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {ExecutionArgs & { context: string[]}} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        return `new string[] { \"${context.join("\", \"")}\"}`
    }
}

export default StringArraySchemaResolver