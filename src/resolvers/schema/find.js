import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (provider) {
    return {
        execute: async ({ context, ...options }) => {

            const findContext = Builder(Find)
                .in(await provider.schemaVariableResolver.execute({context: context.in, ...options }))
                .value(await provider.schemaMatchResolver.execute({context: context.value, ...options }))
                .build()

            //parse template
            return await compileTemplate(path.join(provider.schemaTemplate, `find.hbs`), findContext)
        }
    }
}

class Find {
    in
    value
}