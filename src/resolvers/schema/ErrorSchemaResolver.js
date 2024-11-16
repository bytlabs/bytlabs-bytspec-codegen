import { ExecutionArgs } from "../../def/executionArgs.js";
import { Provider } from "../../def/provider.js";

/**
* Description placeholder
*/
class ErrorSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of ErrorSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {ExecutionArgs & { context: any }} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        return "//TODO ErrorSchemaResolver not implemented"
    }
}

export default ErrorSchemaResolver