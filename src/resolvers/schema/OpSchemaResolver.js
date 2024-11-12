import _ from "lodash"

/**
* Description placeholder
*/
class OpSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of OpSchemaResolver.
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
        const opKey = _.chain(context)
            .keys()
            .first()
            .value();

        const resolverName = `schema${opKey}Resolver`;

        return await opts[resolverName].execute({ context: context[opKey], ...options })
    }
}

export default OpSchemaResolver