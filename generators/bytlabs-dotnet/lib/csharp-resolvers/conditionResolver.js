import variableResolver from "./variableResolver.js"

const conditionResolver = (condition, boundedContext) => {
    if(condition.exists) {
        return `${variableResolver(condition.exists)} != null`
    }
    if(condition.not) {
        return `!(${conditionResolver(condition.not)})`
    }
}

export default conditionResolver;