import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate.js';
import { Builder } from 'builder-pattern';
import path from "path"
import { Provider, ExecutionArgs } from "./../def.js"

/**
* Description placeholder
*/
class InvokeSchemaResolver {
    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of InvokeSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {InvokeExecutionArgs} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        const parameters = await Promise.all(context.method.parameters
            .map(async value => await this.provider.variableSchemaResolver.execute({ context: value, ...options })))

        const invokeContext = Builder(InvokeTempleContext)
            .target(await this.provider.variableSchemaResolver.execute({ context: context.onTarget, ...options }))
            .name(await this.provider.methodSchemaResolver.execute({ context: context.method.name, ...options }))
            .parameters(parameters)
            .build()

        return await compileTemplate(path.join(this.provider.schemaTemplate, `invoke.hbs`), invokeContext)
    }
}

export default InvokeSchemaResolver

/**
* Description placeholder
*/
export class InvokeExecutionArgsContextMethod {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    name

    
    /**
     * Description placeholder
     *
     * @type {string[]}
     */
    parameters
}

/**
* Description placeholder
*/
export class InvokeExecutionArgsContext {

    
    /**
     * Description placeholder
     *
     * @type {InvokeExecutionArgsContextMethod}
     */
    method

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    onTarget
}

/**
* Description placeholder
*/
export class InvokeExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {InvokeExecutionArgsContext}
     */
    context
}

/**
* Description placeholder
*/
export class InvokeTempleContext {
    /**
    * Description placeholder
    */
    target

    /**
    * Description placeholder
    */
    name

    /**
    * Description placeholder
    */
    parameters
}
