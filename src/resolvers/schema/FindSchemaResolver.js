import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"


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
    * @param {ExecutionArgs} param
    * @returns {string}
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
class FindTemplateContext {
    
    /**
    * Description placeholder
    */
    in

    
    /**
    * Description placeholder
    */
    value
}