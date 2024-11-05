import lodash from "lodash"

const resolveExtendedFields = (type, boundedContext, fields = {}) => {
    if(lodash.isString(type)) {
        let typeRef = boundedContext;
        type.split("/").slice(1).forEach(element => {
            typeRef = typeRef[element]
        });
        return resolveExtendedFields(typeRef, boundedContext)
    }

    if (type.extends) {
        const breadcrumbs = type.extends.type.split("/").slice(1)
        let entity = boundedContext;
        for (let breadcrumb of breadcrumbs) {
            entity = entity[breadcrumb];
        }
        fields = { ...fields, ...resolveExtendedFields(entity, boundedContext, fields) }

    }

    fields = { ...fields, ...type.fields };

    if (type.extends && type.extends.omit) {
        fields = lodash.omit(fields, type.extends.omit)
    }

    return fields;
}

export default resolveExtendedFields;