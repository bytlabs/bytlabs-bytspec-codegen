import { pascalCase } from "change-case"
import _ from "lodash"

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
    * @param {ExecutionArgs} param
    * @returns {string}
    * 
    */
    async execute({ context, ...options }) {
        const defaultValueResolver = async (type, itemType) => {
            if (type && type.startsWith("#")) {
                const typeName = lodash.last(type.split("/"))
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
                    return `new List<${await opts.typeResolver.execute(itemType)}>()`
                default:
                    return `new ${type}()`;
            }
        }

        //parse template
        return await defaultValueResolver(context.type, context.itemType)
    }
}

export default TypeDefaultSchemaResolver
