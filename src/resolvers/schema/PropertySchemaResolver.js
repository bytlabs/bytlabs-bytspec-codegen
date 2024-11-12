import { pascalCase } from "change-case";

/**
* Description placeholder
*/
class PropertySchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of PropertySchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {ExecutionArgs} param
    * @returns {string}
    * 
    */
    async execute({ context, ...options }) {
        return pascalCase(context)
    }
}

export default PropertySchemaResolver