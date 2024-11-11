
import { Builder } from 'builder-pattern';
import path from "path"
import randomName from '../../utils/randomName';
import compileTemplate from '../../utils/compileTemplate';


/**
 * Resolves aggregate schemas.
 * This resolver defines the flow for retrieving an aggregate from the repository,
 * allowing actions to be performed on the aggregate as specified in the domain layer.
 *
 * @export
 * @class SchemaAggregateResolver
 * @typedef {SchemaAggregateResolver}
 */
export default class SchemaAggregateResolver {
    
    /**
     * Creates an instance of SchemaAggregateResolver.
     *
     * @constructor
     * @param {Provider} provider
     */
    constructor(provider) {
        this.provider = provider;
    }
    
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

        //build context
        const actions = await Promise.all(
            context.actions.map(async action =>
                Builder(Action)
                    .name(await this.provider.schemaAggregateActionResolver.execute({ context: action.name, ...options }))
                    .parameters(Promise.all(action.parameters.map(async param => await this.provider.schemaVariableResolver.execute({ context: param, ...options }))))
                    .build()
            ));

        const aggregateContext = Builder(Aggregate)
            .name(randomName())
            .op(await this.provider.schemaAggregateOpResolver.execute({ context, ...options }))
            .actions(actions)
            .build()

        //parse template
        return await compileTemplate(path.join(this.provider.schemaTemplate, "aggregate.hbs"), aggregateContext)

    }
}

/**
 * This class contains method details to invoke on an aggregate instance
 *
 * @class Action
 * @typedef {Action}
 */
class Action {
    /**
     * Domain object's action name
     *
     * @type {string}
     */
    name
    /**
     * Description placeholder
     *
     * @type {Object[]}
     */
    parameters
}

/**
 * This class contains details to retreive and perfrom operation on an aggregate
 *
 * @class Aggregate
 * @typedef {Aggregate}
 */
class Aggregate {
    /**
     * Variable name for aggregate instance
     *
     * @type {string}
     */
    name
    /**
     * Operation to retreive aggregate instance
     *
     * @type {string}
     */
    op
    /**
     * List of actions to perform on aggregate instance
     *
     * @type {Action[]}
     */
    actions
}


