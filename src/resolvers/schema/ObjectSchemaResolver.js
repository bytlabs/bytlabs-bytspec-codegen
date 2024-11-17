import { pascalCase } from "change-case";
import { ExecutionArgs } from "../../def/executionArgs.js";
import { Provider } from "../../def/provider.js";
import { ObjectSchema } from "../../schema.js";
import _ from "lodash"
import { Builder } from "builder-pattern";
import compileTemplate from "../../utils/compileTemplate.js";
import path from "path"
import randomName from "../../utils/randomName.js";

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
    * @param {ExecutionArgs & {context: ObjectSchema}} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {

        const target = options.targetName ?? randomName();

        const body = await Promise.all(context.from.map(async stage => {
            const data = await this.provider.objectOpSchemaResolver.execute({ context: stage, ...options,  targetName: target })
            return data;
        }))

        const as = await this.provider.typeSchemaResolver.execute({ context: { type: context.of, items: null }, ...options });

        const templateContext = Builder(ObjectTemplateContext)
            .body(body)
            .target(target)
            .as(as)
            .build();

        return await compileTemplate(path.join(this.provider.schemaTemplate, `object.hbs`), templateContext)
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
    target


    /**
     * Description placeholder
     *
     * @type {string[]}
     */
    body


    /**
     * Description placeholder
     *
     * @type {string}
     */
    as
}