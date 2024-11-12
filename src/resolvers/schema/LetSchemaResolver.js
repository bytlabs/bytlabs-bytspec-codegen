import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"

/**
* Description placeholder
*/
class LetSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of LetSchemaResolver.
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
        const letName = _.chain(context)
            .keys()
            .first()
            .value();

        const letContext = Builder(LetTemplateContext)
            .name(letName)
            .expression(await this.provider.opSchemaResolver.execute({ context: context[letName], ...options }))
            .build()

        //parse template
        return await compileTemplate(path.join(this.provider.schemaTemplate, `let.hbs`), letContext)
    }
}

export default LetSchemaResolver

/**
* Description placeholder
*/
class LetTemplateContext {

    /**
    * Description placeholder
    */
    name

    /**
    * Description placeholder
    */
    expression
}