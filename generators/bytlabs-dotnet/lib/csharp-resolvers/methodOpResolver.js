import variableResolver from "./variableResolver.js";
import matchSyntaxResolver from "./matchSyntaxResolver.js";
import lodash from "lodash"

const methodOpResolver = op => {
    if (op.let) {
        const varName = lodash.first(Object.keys(op.let));
        return `var ${varName} = ${methodOpResolver(op.let[varName])}`
    }
    if (op.push) {
        const to = variableResolver(op.push.to)
        const value = variableResolver(op.push.value)
        return `${to}.Add(${value})`
    }
    if (op.find) {
        const $in = variableResolver(op.find.in)
        const value = matchSyntaxResolver(op.find.where)
        return `${$in}.Where(${value})`
    }
}

export default methodOpResolver;