import _ from "lodash"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            const opKey = _.chain(context)
                                .keys()
                                .first()
                                .value();

            const resolverName = `schema${opKey}Resolver`;
            
            return await opts[resolverName].execute({ context: context[opKey], ...options })
        }
    }
}
