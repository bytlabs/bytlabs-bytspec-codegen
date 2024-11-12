import { pascalCase } from "change-case";


/**
* Description placeholder
*/
class AggregateActionSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of AggregateActionSchemaResolver.
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

export default AggregateActionSchemaResolver