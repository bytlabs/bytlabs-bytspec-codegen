import CommandFileResolver from "./project/commands/CommandFileResolver.js"
import EntitiesFileResolver from "./project/entities/EntitiesFileResolver.js"
import MiscFileResolver from "./project/MiscFileResolver.js"
import AggregateActionSchemaResolver from "./schema/AggregateActionSchemaResolver.js"
import AggregateOpSchemaResolver from "./schema/AggregateOpSchemaResolver.js"
import AggregateSchemaResolver from "./schema/AggregateSchemaResolver.js"
import ConditionSchemaResolver from "./schema/ConditionSchemaResolver.js"
import FindSchemaResolver from "./schema/FindSchemaResolver.js"
import IfSchemaResolver from "./schema/IfSchemaResolver.js"
import InvokeSchemaResolver from "./schema/InvokeSchemaResolver.js"
import LetSchemaResolver from "./schema/LetSchemaResolver.js"
import MapFieldsSchemaResolver from "./schema/MapFieldsSchemaResolver.js"
import MatchSchemaResolver from "./schema/MatchSchemaResolver.js"
import MethodSchemaResolver from "./schema/MethodSchemaResolver.js"
import OpSchemaResolver from "./schema/OpSchemaResolver.js"
import PropertySchemaResolver from "./schema/PropertySchemaResolver.js"
import PushSchemaResolver from "./schema/PushSchemaResolver.js"
import TypeDefaultSchemaResolver from "./schema/TypeDefaultSchemaResolver.js"
import TypeSchemaResolver from "./schema/TypeSchemaResolver.js"
import UnlessSchemaResolver from "./schema/UnlessSchemaResolver.js"
import VariableSchemaResolver from "./schema/VariableSchemaResolver.js"

/**
 * Defination for the resolver argument
 */
export class ExecutionArgs {

    /**
     * Contains information of executing BoundedContext
     * 
     * @type {Object}
     */
    boundedContext

    /**
     * Contains information of executing Domain object
     * 
     * @type {Object | undefined}
     */
    domainObject

    /**
     * Contains information of executing Command
     * 
     * @type {Object | undefined}
     */
    command
}

/**
 * Defination for the container
 */
export class Provider {
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

    /**
     * Description placeholder
     *
     * @type {string}
     */
    projectTemplate

    
    /**
     * Description placeholder
     *
     * @type {CommandFileResolver}
     */
    commandFileResolver

    
    /**
     * Description placeholder
     *
     * @type {EntitiesFileResolver}
     */
    entitiesFileResolver

    
    /**
     * Description placeholder
     *
     * @type {MiscFileResolver}
     */
    miscFileResolver
}

/**
* Description placeholder
*/
export class FileResolverArgs {

    
    /**
     * Description placeholder
     *
     * @type {{boundedContexts: any}}
     */
    spec

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    outputDirectory
}