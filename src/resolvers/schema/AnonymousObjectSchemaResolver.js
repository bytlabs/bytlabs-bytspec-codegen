import { ExecutionArgs } from "../../def/executionArgs.js";
import { Provider } from "../../def/provider.js";

/**
* Description placeholder
*/
class AnonymousObjectSchemaResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of AnonymousObjectSchemaResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {ExecutionArgs & {context:any}} param
    * @returns {Promise<string>}
    * 
    */
    async execute({ context, ...options }) {
        // Helper function to format values as C# syntax
        const formatValue = async (value) => {
            if (Array.isArray(value)) {
                return `new[] { ${value.map(formatValue).join(", ")} }`;
            } else if (typeof value === "object" && value !== null) {
                return this.provider.anonymousObjectSchemaResolver.execute({ context: value, ...options });
            } else if (typeof value === "string") {
                return `"${value.replace(/"/g, '\\"')}"`; // Escape quotes
            } else if (typeof value === "boolean") {
                return value ? "true" : "false";
            } else if (value === null) {
                return "null";
            } else {
                return value; // For numbers or other primitive types
            }
        }

        // Build the C# anonymous object
        let properties = await Promise.all(Object.entries(context)
            .map(async ([key, value]) => `${await this.provider.propertySchemaResolver.execute({ context: key, ...options })} = ${formatValue(value)}`));
        const joinedProps = properties.join(", ")

        return `new {${joinedProps}}`;
    }
}

export default AnonymousObjectSchemaResolver