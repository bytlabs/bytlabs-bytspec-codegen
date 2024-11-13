import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate.js';
import { Builder } from 'builder-pattern';
import path from "path"
import { Provider, ExecutionArgs } from "./../def.js"
import { ConditionExecutionArgsContext } from "./ConditionSchemaResolver.js";

/**
* Description placeholder
*/
class IfSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of IfSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {IfExecutionArgs} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        const ifContext = Builder(IfTemplateContext)
                            .expression(await this.provider.conditionSchemaResolver.execute({ context: context.condition, ...options }))
                            .then(await this.provider.opSchemaResolver.execute({ context: context.then, ...options }))
                            .build()

        //parse template
        return await compileTemplate(path.join(this.provider.schemaTemplate, `if.hbs`), ifContext)
    }
}

export default IfSchemaResolver


/**
* Description placeholder
*/
export class IfExecutionArgsContext {

    
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
export class IfExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {IfExecutionArgsContext}
     */
    context
}


/**
* Description placeholder
*/
export class IfTemplateContext {
    /**
    * Description placeholder
    */
    expression

    /**
    * Description placeholder
    */
    then
}