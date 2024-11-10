import _ from "lodash"
import { compileTemplate } from './utils';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            const findContext = Builder(Find)
                .in(await opts.variableResolver.execute({context: context.in, ...options }))
                .value(await opts.matchResolver.execute({context: context.value, ...options }))
                .build()

            //parse template
            return await compileTemplate(path.join(opts.templatesDir, `resolvers/find.hbs`), findContext)
        }
    }
}

class Find {
    in
    value
}