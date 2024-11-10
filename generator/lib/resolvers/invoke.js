import _ from "lodash"
import { compileTemplate } from './utils';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            const parameters = await Promise.all(context.method.parameters
                .map(async value => await opts.variableResolver.execute({ context: value, ...options })))

            const invokeContext = Builder(Invoke)
                .target(await opts.variableResolver.execute({ context: context.onTarget, ...options }))
                .name(await opts.methodResolver.execute({ context: context.method.name, ...options }))
                .parameters(parameters)
                .build()

            return await compileTemplate(path.join(opts.templatesDir, `resolvers/invoke.hbs`), invokeContext)
        }
    }
}


class Invoke {
    target
    name
    parameters
}
