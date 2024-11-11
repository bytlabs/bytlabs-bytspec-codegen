import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"

/**
 * Condition schema resolver
 *
 * @export
 * @param {Provider} provider
 * @returns {Resolver}
 */
export default function condition (provider) {
    return {
        execute: async ({ context, ...options }) => {

            const opKey = _.chain(context)
                                .pick(['isEmpty', 'not'])   
                                .keys()              
                                .first()
                                .value();

            //build context
            const variable = context.isEmpty? Builder(Variable)
                                                .name(await provider.schemaVariableResolver.execute({ context: context.isEmpty, ...options }))
                                                .build() : null;

            const not = context.not? Builder(Not)
                                                .expression(await provider.schemaConditionResolver.execute({ context: context.not, ...options }))
                                                .build() : null;

            const conditionContext = Builder(Condition)
                                .variable(variable)
                                .not(not)
                                .build()

            //parse template
            return await compileTemplate(path.join(provider.schemaTemplate, `conditions/${opKey}.hbs`), conditionContext)
        }
    }
}


class Condition {
    variable
    not
}

class Variable {
    name;
}


class Not {
    expression
}