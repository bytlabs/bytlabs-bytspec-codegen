import { compileTemplate, randomName } from './utils';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context }) => {

            //build context
            const actions = await Promise.all(
                context.actions.map(async action => 
                    Builder(Action)
                        .name(await opts.aggregateActionResolver.execute(action.name))
                        .parameters(await opts.variableResolver.execute(action.parameters))
                        .build()
                ));

            const aggregateContext = Builder(Aggregate)
                                        .name(randomName())
                                        .op(await opts.aggregateOpResolver.execute(context))
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


