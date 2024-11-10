import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (provider) {
    return {
        execute: async ({ context, ...options }) => {

            const parameters = await Promise.all(context.method.parameters
                .map(async value => await provider.schemaVariableResolver.execute({ context: value, ...options })))

            const invokeContext = Builder(Invoke)
                .target(await provider.schemaVariableResolver.execute({ context: context.onTarget, ...options }))
                .name(await provider.schemaMethodResolver.execute({ context: context.method.name, ...options }))
                .parameters(parameters)
                .build()

            return await compileTemplate(path.join(provider.schemaTemplate, `invoke.hbs`), invokeContext)
        }
    }
}


class Invoke {
    target
    name
    parameters
}
