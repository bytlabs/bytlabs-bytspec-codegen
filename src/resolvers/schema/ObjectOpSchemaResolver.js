import { Builder } from "builder-pattern";
import { ExecutionArgs } from "../../def/executionArgs.js";
import { Provider } from "../../def/provider.js";
import { ObjectStageSchema } from "../../schema.js";
import compileTemplate from "../../utils/compileTemplate.js";
import path from "path"
import _ from "lodash"

/**
* Description placeholder
*/
class ObjectOpSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of ObjectOpSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {ExecutionArgs & {context: ObjectStageSchema}} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {

        const opKey = _.chain(context)
                .pick(['merge', 'omit'])
                .keys()
                .first()
                .value();

        let mergeData = null;

        if(_.isString(context.merge)) {
            mergeData = await this.provider.variableSchemaResolver.execute({ context: context.merge, ...options });
        }
        else if(_.isObject(context.merge)) {
            mergeData = await this.provider.anonymousObjectSchemaResolver.execute({ context: context.merge, ...options })
        }

        
        let omitData = null;
        if(_.isArray(context.omit)) {
            const omitProps = await Promise.all(context.omit.map(async field=> this.provider.propertySchemaResolver.execute({ context: field, ...options})))
            omitData = await this.provider.stringArraySchemaResolver.execute({ context: omitProps, ...options})
        }

        const templateContext = Builder(ObjectMergeTemplateContext)
                                    .target(options.targetName)
                                    .merge(mergeData)
                                    .omit(omitData)

        return compileTemplate(path.join(this.provider.schemaTemplate, `objectOps/${opKey}.hbs`), templateContext);
    }
}

export default ObjectOpSchemaResolver

/**
* Description placeholder
*/
export class ObjectMergeTemplateContext {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    target

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    merge

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    omit
}