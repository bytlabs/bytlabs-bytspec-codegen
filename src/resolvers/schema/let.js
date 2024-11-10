import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (provider) {
    return {
        execute: async ({ context, ...options }) => {

            const letName = _.chain(context)
                                .keys()
                                .first()
                                .value();

            const letContext = Builder(Let)
                .name(letName)
                .expression(await provider.schemaOpResolver.execute({ context: context[letName], ...options }))
                .build()

            //parse template
            return await compileTemplate(path.join(provider.schemaTemplate, `let.hbs`), letContext)
        }
    }
}


class Let {
    name
    expression
}