import { pascalCase } from "change-case"
import _ from "lodash"
import { Provider, ExecutionArgs } from "./../def.js"

/**
* Description placeholder
*/
class TypeDefaultSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of TypeDefaultSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {TypeDefaultExecutionArgs} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        const defaultValueResolver = async (type, itemType) => {
            if (type && type.startsWith("#")) {
                const typeName = _.last(type.split("/"))
                return `new ${pascalCase(typeName)}()`
            }

            switch (type) {
                case "number":
                    return "0";
                case "text":
                case "string":
                    return "string.Empty"
                case "date":
                    return "DateTime.Now()"
                case "boolean":
                    return "false"
                case "void":
                    return "null"
                case "collection":
                    return `new List<${await this.provider.typeSchemaResolver.execute(itemType)}>()`
                default:
                    return `new ${type}()`;
            }
        }

        //parse template
        return await defaultValueResolver(context.type, context.itemType)
    }
}

export default TypeDefaultSchemaResolver


/**
* Description placeholder
*/
export class TypeDefaultExecutionArgsContext {

    
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
    itemType
}


/**
* Description placeholder
*/
export class TypeDefaultExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {TypeDefaultExecutionArgsContext}
     */
    context
}
