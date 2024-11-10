import _ from "lodash"
import { compileTemplate } from '../utils/utils.js';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            const ifContext = Builder(If)
                                .expression(await opts.conditionResolver.execute({ context: context.condition, ...options }))
                                .then(await opts.opResolver.execute({ context: context.then, ...options }))
                                .build()

            //parse template
            return await compileTemplate(path.join(opts.templatesDir, `resolvers/if.hbs`), ifContext)
        }
    }
}


class If {
    expression
    then
}