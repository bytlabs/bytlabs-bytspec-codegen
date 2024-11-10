import { compileTemplate, randomName } from '../utils/utils.js';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            //build context
            const actions = await Promise.all(
                context.actions.map(async action => 
                    Builder(Action)
                        .name(await opts.aggregateActionResolver.execute({ context: action.name, ...options }))
                        .parameters(await opts.variableResolver.execute({ context: action.parameters, ...options }))
                        .build()
                ));

            const aggregateContext = Builder(Aggregate)
                                        .name(randomName())
                                        .op(await opts.aggregateOpResolver.execute({ context, ...options }))
                                        .actions(actions)
                                        .build()

            //parse template
            return await compileTemplate(path.join(opts.templatesDir, "resolvers/aggregate.hbs"), aggregateContext)

        }
    }
}

class Action {
    name;
    parameters;
}

class Aggregate {
    name;
    op;
    actions;
}


