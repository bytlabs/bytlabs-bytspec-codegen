import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate.js';
import { Builder } from 'builder-pattern';
import path from "path"
import { Provider, ExecutionArgs } from "./../def.js"
import { ConditionExecutionArgsContext } from "./ConditionSchemaResolver.js";

/**
* Description placeholder
*/
class UnlessSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of UnlessSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {UnlessExecutionArgs} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        const unlessContext = Builder(UnlessTemplateContext)
            .expression(await this.provider.conditionSchemaResolver.execute({ context: context.condition, ...options }))
            .then(await this.provider.opSchemaResolver.execute({ context: context.then, ...options }))
            .build()

        //parse template
        return await compileTemplate(path.join(this.provider.schemaTemplate, `unless.hbs`), unlessContext)
    }
}

export default UnlessSchemaResolver

/**
* Description placeholder
*/
export class UnlessExecutionArgsContext {

    
    /**
     * Description placeholder
     *
     * @type {ConditionExecutionArgsContext}
     */
    condition

    
    /**
     * Description placeholder
     *
     * @type {Object}
     */
    then

}

/**
* Description placeholder
*/
export class UnlessExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {UnlessExecutionArgsContext}
     */
    context
}


/**
* Description placeholder
*/
export class UnlessTemplateContext {

    /**
    * Description placeholder
    */
    expression

    /**
    * Description placeholder
    */
    then
}