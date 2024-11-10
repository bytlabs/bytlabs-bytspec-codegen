import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (provider) {
    return {
        execute: async ({ context, ...options }) => {

            const ifContext = Builder(If)
                                .expression(await provider.schemaConditionResolver.execute({ context: context.condition, ...options }))
                                .then(await provider.schemaOpResolver.execute({ context: context.then, ...options }))
                                .build()

            //parse template
            return await compileTemplate(path.join(provider.schemaTemplate, `if.hbs`), ifContext)
        }
    }
}


class If {
    expression
    then
}