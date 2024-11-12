/**
 * Defination for the container
 */
class Provider {
    /**
     * Description placeholder
     * 
     * @type {AggregateSchemaResolver}
     */
    aggregateSchemaResolver

    /**
     * Description placeholder
     * 
     * @type {AggregateOpSchemaResolver}
     */
    aggregateOpSchemaResolver

    /**
     * Description placeholder
     *
     * @type {ConditionSchemaResolver}
     */
    conditionSchemaResolver

    /**
     * Description placeholder
     *
     * @type {FindSchemaResolver}
     */
    findSchemaResolver

    /**
     * Description placeholder
     *
     * @type {IfSchemaResolver}
     */
    ifSchemaResolver

    /**
     * Description placeholder
     *
     * @type {InvokeSchemaResolver}
     */
    invokeSchemaResolver

    /**
     * Description placeholder
     *
     * @type {LetSchemaResolver}
     */
    letSchemaResolver

    /**
     * Description placeholder
     *
     * @type {MapFieldsSchemaResolver}
     */
    mapFieldsSchemaResolver

    /**
     * Description placeholder
     *
     * @type {MatchSchemaResolver}
     */
    matchSchemaResolver

    /**
     * Description placeholder
     *
     * @type {OpSchemaResolver}
     */
    opSchemaResolver

    /**
     * Description placeholder
     *
     * @type {PushSchemaResolver}
     */
    pushSchemaResolver

    /**
     * Description placeholder
     *
     * @type {TypeSchemaResolver}
     */
    typeSchemaResolver

    /**
     * Description placeholder
     *
     * @type {TypeDefaultSchemaResolver}
     */
    typeDefaultSchemaResolver

    /**
     * Description placeholder
     *
     * @type {UnlessSchemaResolver}
     */
    unlessSchemaResolver

    /**
     * Description placeholder
     *
     * @type {VariableSchemaResolver}
     */
    variableSchemaResolver

    
    /**
     * Description placeholder
     *
     * @type {AggregateActionSchemaResolver}
     */
    aggregateActionSchemaResolver

    
    /**
     * Description placeholder
     *
     * @type {MethodSchemaResolver}
     */
    methodSchemaResolver

    
    /**
     * Description placeholder
     *
     * @type {PropertySchemaResolver}
     */
    propertySchemaResolver

    /**
     * Description placeholder
     *
     * @type {string}
     */
    schemaTemplate
}


/**
 * Defination for the resolver argument
 */
class ExecutionArgs {

    /**
     * Contains information of the schema object
     * 
     * @type {Object}
     */
    context

    /**
     * Contains information of executing BoundedContext
     * 
     * @type {Object}
     */
    boundedContext

    /**
     * Contains information of executing Domain object
     * 
     * @type {Object}
     */
    domainObject

    /**
     * Contains information of executing Command
     * 
     * @type {Object}
     */
    command
}