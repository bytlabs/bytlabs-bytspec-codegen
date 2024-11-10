import _ from "lodash"
import { compileTemplate } from '../utils/utils.js';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            const pushContext = Builder(Push)
                .to(await opts.variableResolver.execute({context: context.to, ...options }))
                .value(await opts.variableResolver.execute({context: context.value, ...options }))
                .build()

            //parse template
            return await compileTemplate(path.join(opts.templatesDir, `resolvers/push.hbs`), pushContext)
        }
    }
}

class Push {
    to
    value
}