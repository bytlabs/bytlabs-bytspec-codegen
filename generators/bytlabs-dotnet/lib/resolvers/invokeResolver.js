import variableResolver from "./variableResolver.js";
import { pascalCase } from "change-case";

 export default function invokeResolver(invokeObject, boundedContext) {
    const target = variableResolver(invokeObject.target);
    const methodName = Object.keys(invokeObject.method)[0]
    const result = [];
    result.push(`${target}.${pascalCase(methodName)}(`)
    const paraNames = Object.keys(invokeObject.method[methodName]);
    paraNames.forEach((paraName, index)=>{
        result.push(variableResolver(invokeObject.method[methodName][paraName]))
        if(index < (paraNames.length - 1)) {
            result.push(`,`)
        }        
    });
    result.push(`);`)
    return result.join("");
  }
  
 