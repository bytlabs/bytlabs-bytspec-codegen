
import { Builder } from 'builder-pattern';
import path from "path"
import randomName from '../../utils/randomName';
import compileTemplate from '../../utils/compileTemplate';

export default function (provider) {
    return {
        execute: async ({ context, ...options }) => {

            //build context
            const actions = await Promise.all(
                context.actions.map(async action => 
                    Builder(Action)
                        .name(await provider.schemaAggregateActionResolver.execute({ context: action.name, ...options }))
                        .parameters(await provider.schemaVariableResolver.execute({ context: action.parameters, ...options }))
                        .build()
                ));

            const aggregateContext = Builder(Aggregate)
                                        .name(randomName())
                                        .op(await provider.schemaAggregateOpResolver.execute({ context, ...options }))
                                        .actions(actions)
                                        .build()

            //parse template
            return await compileTemplate(path.join(provider.schemaTemplate, "aggregate.hbs"), aggregateContext)

        }
    }
}

class Action {
    name
    parameters
}

class Aggregate {
    name
    op
    actions
}


