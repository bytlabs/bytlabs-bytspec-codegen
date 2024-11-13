import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate.js';
import { Builder } from 'builder-pattern';
import path from "path"
import { Provider, ExecutionArgs } from "./../def.js"
import { MapFieldsExecutionArgsContext } from "./MapFieldsSchemaResolver.js";

/**
* Description placeholder
*/
class FindSchemaResolver {
    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of FindSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {FindExecutionArgs} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        const findContext = Builder(FindTemplateContext)
            .in(await this.provider.variableSchemaResolver.execute({ context: context.in, ...options }))
            .value(await this.provider.mapFieldsSchemaResolver.execute({ context: context.value, ...options }))
            .build()

        //parse template
        return await compileTemplate(path.join(this.provider.schemaTemplate, `find.hbs`), findContext)
    }
}

export default FindSchemaResolver

/**
* Description placeholder
*/
export class FindExecutionArgsContext {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    in

    
    /**
     * Description placeholder
     *
     * @type {MapFieldsExecutionArgsContext}
     */
    value
}

/**
* Description placeholder
*/
export class FindExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {FindExecutionArgsContext}
     */
    context
}


/**
 * Description placeholder
 */
export class FindTemplateContext {
    
    /**
    * Description placeholder
    */
    in

    
    /**
    * Description placeholder
    */
    value
}