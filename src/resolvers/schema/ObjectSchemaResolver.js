import { pascalCase } from "change-case";
import { ExecutionArgs } from "../../def/executionArgs.js";
import { Provider } from "../../def/provider.js";
import { ObjectStageSchema } from "../../schema.js";
import _ from "lodash"
/**
* Description placeholder
*/
class ObjectSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of ObjectSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {ExecutionArgs & {context: ObjectStageSchema[]}} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {

        const body = context.map(stage=>{
            const opKey = _.chain(stage)
                .pick(['merge', 'omit'])
                .keys()
                .first()
                .value();

            const data = this.provider[`object${pascalCase(opKey)}SchemaResolver`]({context:stage[opKey], ...options})
        })

        return ""
    }
}

export default ObjectSchemaResolver

/**
* Description placeholder
*/
export class ObjectTemplateContext {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    objectVariableName

    
    /**
     * Description placeholder
     *
     * @type {string[]}
     */
    body
}