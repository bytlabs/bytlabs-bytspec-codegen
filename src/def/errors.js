export class SpecNotImplementedError extends Error {
    constructor() {
        super("Spec not implemented exception")
    }
}

export class ArgumentCannotBeNullError extends Error {
    constructor(fieldName) {
        super(`'${fieldName}' cannot be undefined or null`)
    }
}