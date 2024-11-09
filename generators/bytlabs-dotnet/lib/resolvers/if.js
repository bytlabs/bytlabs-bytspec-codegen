import conditionResolver from "./condition.js";
import methodOpResolver from "./op.js";

export default function ifResolver(ifObject, boundedContext) {
    const condition = conditionResolver(ifObject.condition)
    return `if (${condition}) {
        ${methodOpResolver(ifObject.then, boundedContext)}
    }`;
}