import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (provider) {
    return {
        execute: async ({ context, ...options }) => {

            const pushContext = Builder(Push)
                .to(await provider.schemaVariableResolver.execute({context: context.to, ...options }))
                .value(await provider.schemaVariableResolver.execute({context: context.value, ...options }))
                .build()

            //parse template
            return await compileTemplate(path.join(provider.schemaTemplate, `push.hbs`), pushContext)
        }
    }
}

class Push {
    to
    value
}