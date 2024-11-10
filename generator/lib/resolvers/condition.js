import _ from "lodash"
import { compileTemplate } from './utils';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context }) => {

            const opKey = _.chain(context)
                                .pick(['isEmpty', 'not'])   
                                .keys()              
                                .first()
                                .value();

            //build context
            const variable = context.isEmpty? Builder(Variable)
                                                .name(await opts.variableResolver.execute(context.isEmpty))
                                                .build() : null;

            const not = context.not? Builder(Not)
                                                .expression(await opts.conditionResolver.execute(context.isEmpty))
                                                .build() : null;

            const conditionContext = Builder(Condition)
                                .variable(variable)
                                .not(not)
                                .build()

            //parse template
            return await compileTemplate(path.join(opts.templatesDir, `resolvers/conditions/${opKey}.hbs`), conditionContext)
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