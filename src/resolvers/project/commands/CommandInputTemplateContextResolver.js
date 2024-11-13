import { Builder } from "builder-pattern";
import unwrapObj from "../../../utils/unwrapObj.js";
import { ExecutionArgs, Provider } from "../../def.js";
import { pascalCase } from "change-case";
import _ from "lodash"
import { CommandInputSubTypesExecutionArgsInputProperty } from "./CommandInputSubTypesTemplateContextResolver.js";

/**
* Description placeholder
*/
class CommandInputPropertyTemplateContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandInputTemplateContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {CommandInputExecutionArgs} param
    * @returns {Promise<CommandInputPropertyTemplateContext[]>}
    * 
    */
    async execute({ context, ...options }) {

        /**
             * Description placeholder
             *
             * @param {Object<string, CommandInputSubTypesExecutionArgsInputProperty>} obj
             * @returns {(CommandInputSubTypesExecutionArgsInputProperty & { name: string })[]}
             */
        const unwrapWith = (obj) => {
            return unwrapObj(obj)
        }
        
        return await Promise.all(unwrapWith(context)
                .map(async field => {

                    let type = null;

                    if (field.hasPropertiesOf) {

                        const subTypes = await this.provider.commandInputSubTypesTemplateContextResolver.execute({ context: field, ...options})

                        type = _.last(subTypes).class.name;
                    }
                    else {
                        type = await this.provider.typeSchemaResolver.execute({ context: { type: field.type, itemType: field.items }, ...options })
                    }

                    return Builder(CommandInputPropertyTemplateContext)
                            .type(type)
                            .name(pascalCase(field.name))
                            .default(await this.provider.typeDefaultSchemaResolver.execute({ context: { type, itemType: null }, ...options }))
                            .build()
                }))
    }
}

export default CommandInputPropertyTemplateContextResolver

/**
* Description placeholder
*/
export class CommandInputExecutionArgs extends ExecutionArgs {
    
    /**
     * Description placeholder
     *
     * @type {Object<string, CommandInputSubTypesExecutionArgsInputProperty>}
     */
    context
}




/**
* Description placeholder
*/
export class CommandInputPropertyTemplateContext {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    type

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    name

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    default
}
