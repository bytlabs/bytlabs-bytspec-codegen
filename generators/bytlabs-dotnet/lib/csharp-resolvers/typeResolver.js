import lodash from "lodash"
import { pascalCase } from "change-case"

const typeResolver = (type, itemType) => {
    if(type && type.startsWith("#")) {
        const typeName = lodash.last(type.split("/"))
        return pascalCase(typeName)
    }

    switch (type) {
        case "number":
            return "double";
        case "text":
            return "string"
        case "date":
            return "DateTime"
        case "boolean":
            return "bool"
        case "void":
            return "void"
        case "collection":
            return `ICollecton<${typeResolver(itemType)}>`
        default:
            return type;
    }
}

export default typeResolver;