
import conditionResolver from "./condition.js";
import methodOpResolver from "./op.js"

export default function unlessResolver(unlessObject, boundedContext) {
    const condition = conditionResolver(unlessObject.condition)
    return `if (!(${condition})) {
        ${methodOpResolver(unlessObject.then, boundedContext)}
    }`;
}