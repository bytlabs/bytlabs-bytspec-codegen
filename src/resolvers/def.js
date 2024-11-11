/**
 * Defination for a resolver
 *
 * @class Resolver
 * @typedef {Resolver}
 */
class Resolver {

    /**
     * execute method details
     *
     * @async
     * @param {Object} param
     * @param {Object} param.context
     * @param {Object} param.boundedContext
     * @param {Object} param.domainObject
     * @param {Object} param.command
     * @returns {string}
     */
    async execute({ context, ...options }) {
        return ""
    }
}



/**
 * Defination for the container
 *
 * @class Provider
 * @typedef {Provider}
 */
class Provider {
    /**
     * @see aggregate
     *
     * @type {Resolver}
     */
    schemaAggregateResolver
    /**
     * @see aggregateOp
     *
     * @type {Resolver}
     */
    schemaAggregateOpResolver
    /**
     * @see aggregateOp
     *
     * @type {Resolver}
     */
    schemaConditionResolver
    schemaFindResolver
    schemaIfResolver
    schemaInvokeResolver
    schemaLetResolver
    schemaMapFieldsResolver
    schemaMatchResolver
    schemaOpResolver
    schemaPushResolver
    schemaTypeResolver
    schemaTypeDefaultResolver
    schemaUnlessResolver
    schemaVariableResolver
    schemaTemplate
}