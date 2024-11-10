import { pascalCase } from "change-case"

const variableResolver = (specVariable) => {

    if (specVariable.includes("@identity.claims.sub")) {
        return `userContextProvider.GetUserId()`
    }

    if (specVariable.startsWith("@fields")) {
        return specVariable.split(".")
            .slice(1)
            .map(prop => pascalCase(prop))
            .join(".")
    }

    if (specVariable.startsWith("@parameters")) {
        return specVariable.split(".")
            .slice(1)
            .map((prop, index) => index > 0 ? pascalCase(prop) : prop)
            .join(".")
    }

    if (specVariable.startsWith("@let")) {
        return specVariable.split(".")
            .slice(1)
            .map((prop, index) => index > 0 ? pascalCase(prop) : prop)
            .join(".")
    }

    if (specVariable.startsWith("@input")) {
        return specVariable.split(".")
            .map(prop => pascalCase(prop))
            .map(prop => prop.replace("@input", "input"))
            .join(".")
    }
}

export default variableResolver;