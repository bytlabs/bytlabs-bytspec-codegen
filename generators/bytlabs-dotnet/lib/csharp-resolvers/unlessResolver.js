
import conditionResolver from "./conditionResolver.js";
import methodOpResolver from "./methodOpResolver.js"

export default function unlessResolver(unlessObject, boundedContext) {
    const condition = conditionResolver(unlessObject.condition)
    return `if (!(${condition})) {
        ${methodOpResolver(unlessObject.then, boundedContext)}
    }`;
}