import _ from "lodash"
import { compileTemplate } from './utils';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            const letName = _.chain(context)
                                .keys()
                                .first()
                                .value();

            const letContext = Builder(Let)
                .name(letName)
                .expression(await opts.opResolver.execute({ context: context[letName], ...options }))
                .build()

            //parse template
            return await compileTemplate(path.join(opts.templatesDir, `resolvers/let.hbs`), letContext)
        }
    }
}


class Let {
    name
    expression
}