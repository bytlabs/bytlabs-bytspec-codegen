import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate.js';
import { Builder } from 'builder-pattern';
import path from "path"
import { Provider, ExecutionArgs } from "./../def.js"

/**
* Description placeholder
*/
class PushSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of PushSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {PushExectionArgs} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        const pushContext = Builder(PushTemplateContext)
            .to(await this.provider.variableSchemaResolver.execute({ context: context.to, ...options }))
            .value(await this.provider.variableSchemaResolver.execute({ context: context.value, ...options }))
            .build()

        //parse template
        return await compileTemplate(path.join(this.provider.schemaTemplate, `push.hbs`), pushContext)
    }
}

export default PushSchemaResolver


/**
* Description placeholder
*/
export class PushExectionArgsContext {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    to

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    value
}


/**
* Description placeholder
*/
export class PushExectionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {PushExectionArgsContext}
     */
    context
}

/**
* Description placeholder
*/
class PushTemplateContext {

    /**
    * Description placeholder
    */
    to

    /**
    * Description placeholder
    */
    value
}