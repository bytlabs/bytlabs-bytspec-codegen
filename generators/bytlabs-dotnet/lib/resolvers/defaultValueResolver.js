import lodash from "lodash"
import { pascalCase } from "change-case"
import typeResolver from "./typeResolver.js"

const defaultValueResolver = (type, itemType) => {
    if(type && type.startsWith("#")) {
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
            return `new List<${typeResolver(itemType)}>()`
        default:
            return type;
    }
}

export default defaultValueResolver;