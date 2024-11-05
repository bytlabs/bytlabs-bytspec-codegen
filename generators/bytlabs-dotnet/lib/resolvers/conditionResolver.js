import variableResolver from "./variableResolver.js"

const conditionResolver = (condition, boundedContext) => {
    if(condition.isEmpty) {
        return `${variableResolver(condition.isEmpty)} == null`
    }
    if(condition.not) {
        return `!(${conditionResolver(condition.not)})`
    }
}

export default conditionResolver;