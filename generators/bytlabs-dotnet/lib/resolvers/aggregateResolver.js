import variableResolver from "./variableResolver.js";
import lodash from "lodash"
import unwrapObj from "../utils/unwrapObj.js";
import { pascalCase } from "change-case";
import matchSyntaxResolver from "./matchSyntaxResolver.js";
import BL from 'bl'

const resolveAggregateOperation = (aggregateName, operationName, input) => {
    if(operationName == 'findOne') {
        return `(await ${aggregateName}Repository.FindAllByAsync(${matchSyntaxResolver(input)}, cancellationToken)).SingleOrDefault()`;
    }
}

function generateRandomVariableName(length = 8) {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const chars = letters + '0123456789';
  
    // Generate the first letter and then the rest of the characters
    return lodash.sample(letters) + lodash.times(length - 1, () => lodash.sample(chars)).join('');
  }

export default function aggregateResolver(aggregateObject, boundedContext, options) {
    var bl = new BL();
    const aggregateName = lodash.last(aggregateObject.type.split("/"))
    const operationName =  Object.keys(lodash.pick(aggregateObject, ['findOne']))[0]
    const aggregateResultName = `${aggregateName}_${generateRandomVariableName()}`
    bl.append(`var ${aggregateResultName} = ${resolveAggregateOperation(aggregateName, operationName, aggregateObject[operationName])};\n`)
    if(aggregateObject.actions)
    {
        for(let action of aggregateObject.actions) {
            bl.append(`\t\t\t${aggregateResultName}.${pascalCase(action.name)}(`)
            const index = 0;
            const params = Object.keys(action.parameters);
            for(let param of params){
                bl.append(variableResolver(action.parameters[param]))
                const isLast = index == (params.length -1);
                if(!isLast) {                
                    bl.append(",")
                }
            }
            bl.append(`);\n`)
        }
    }
    return bl.toString()
}

