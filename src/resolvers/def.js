/**
 * Defination for the container
 */
class Provider {
    /**
     * @type {SchemaAggregateResolver}
     */
    schemaAggregateResolver
    schemaAggregateOpResolver
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


/**
 * Defination for the resolver argument
 */
class ExecutionArgs {
    /**
     * Contains information of the schema object
     * @type {Object}
     */
    context
    /**
     * Contains information of executing BoundedContext
     * @type {Object}
     */
    boundedContext
    /**
     * Contains information of executing Domain object
     * @type {Object}
     */
    domainObject
    /**
     * Contains information of executing Command
     * @type {Object}
     */
    command
}