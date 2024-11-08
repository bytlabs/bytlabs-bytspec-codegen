import { pascalCase } from "change-case"

const variableResolver = ($var) => {

    if ($var.includes("@identity.claims.sub")) {
        return `userContextProvider.GetUserId()`
    }

    if ($var.startsWith("@fields")) {
        return $var.split(".")
            .slice(1)
            .map(prop => pascalCase(prop))
            .join(".")
    }

    if ($var.startsWith("@parameters")) {
        return $var.split(".")
            .slice(1)
            .map((prop, index) => index > 0 ? pascalCase(prop) : prop)
            .join(".")
    }

    if ($var.startsWith("@let")) {
        return $var.split(".")
            .slice(1)
            .map((prop, index) => index > 0 ? pascalCase(prop) : prop)
            .join(".")
    }

    if ($var.startsWith("@input")) {
        return "input."+$var.split(".")
            .slice(1)
            .map(prop => pascalCase(prop))
            .join(".")
    }

    if ($var.startsWith("@this")) {
        return "this"
    }
}

export default variableResolver;