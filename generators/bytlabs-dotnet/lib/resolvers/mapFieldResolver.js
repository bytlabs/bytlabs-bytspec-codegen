import variableResolver from "./variableResolver.js";
import lodash from "lodash"
import unwrapObj from "./../utils/unwrapObj.js";
import { pascalCase } from "change-case";


export default function mapFieldResolver(mapFieldsObject, boundedContext, { executionContext: entity }) {
    const fromField = variableResolver(mapFieldsObject.from);
    let fields = entity.properties
    fields = lodash.omit(fields, mapFieldsObject.omit || [])
    const result = unwrapObj(fields)
        .map(field => `${pascalCase(field.name)} = ${fromField}.${pascalCase(field.name)};`)
        .join("\n\t")
    return result;
}

