import variableResolver from "./variableResolver.js";
import lodash from "lodash"
import unwrapObj from "./../utils/unwrapObj.js";
import resolveExtendedFields from "./../utils/resolveExtendedFields.js"
import { pascalCase } from "change-case";

 export default function mapFieldResolver(mapFieldsObject, boundedContext) {
    const fromField = variableResolver(mapFieldsObject.from);
    const toField = variableResolver(mapFieldsObject.to)
    let fields = [];
    if(lodash.isObject(mapFieldsObject.fields)){
        fields = unwrapObj(resolveExtendedFields(mapFieldsObject.fields, boundedContext))
    }
    const result = fields
        .map(field=>`${toField}.${pascalCase(field.name)} = ${fromField}.${pascalCase(field.name)};`)
        .join("\n\t")
    return result;
  }
  
 