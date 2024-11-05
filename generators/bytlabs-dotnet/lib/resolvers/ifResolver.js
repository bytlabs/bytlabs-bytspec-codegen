import conditionResolver from "./conditionResolver.js";
import methodOpResolver from "./methodOpResolver.js";

export default function ifResolver(ifObject, boundedContext) {
    const condition = conditionResolver(ifObject.condition)
    return `if (${condition}) {
        ${methodOpResolver(ifObject.then, boundedContext)}
    }`;
}