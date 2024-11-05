import variableResolver from "./variableResolver.js";
import matchSyntaxResolver from "./matchSyntaxResolver.js";
import lodash from "lodash"
import unlessResolver from "./unlessResolver.js";
import mapFieldResolver from "./mapFieldResolver.js";
import ifResolver from "./ifResolver.js";
import invokeResolver from "./invokeResolver.js"

const methodOpResolver = (op, boundedContext, options) => {
    if (op.let) {
        const varName = lodash.first(Object.keys(op.let));
        return `var ${varName} = ${methodOpResolver(op.let[varName], boundedContext)}`
    }
    if (op.push) {
        const to = variableResolver(op.push.to)
        const value = variableResolver(op.push.value)
        return `${to}.Add(${value});`
    }
    if (op.find) {
        const $in = variableResolver(op.find.in)
        const value = matchSyntaxResolver(op.find.where)
        return `${$in}.FirstOrDefault(${value});`
    }
    if(op.unless) {
        return unlessResolver(op.unless, boundedContext)
    }
    if(op.if) {
        return ifResolver(op.if, boundedContext)
    }
    if(op.error) {
        return `throw new Exception("${op.error}");`
    }
    if(op.mapFields) {
        return mapFieldResolver(op.mapFields, boundedContext, options)
    }
    if(op.invoke) {
        return invokeResolver(op.invoke, boundedContext)
    }
}

export default methodOpResolver;