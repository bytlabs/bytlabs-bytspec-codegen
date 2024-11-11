import _ from "lodash"
import compileTemplate from '../../utils/compileTemplate';
import { Builder } from 'builder-pattern';
import path from "path"

/**
 * AggregateOp schema resolver
 *
 * @export
 * @function aggregateOp
 * @param {Provider} provider
 * @returns {Resolver}
 * 
 * @see aggregate
 */
export default function aggregateOp(provider) {
    return {
        execute: async ({ context, ...options }) => {

            const opKey = _.chain(context)
                                .pick(['findOne'])   
                                .keys()              
                                .first()
                                .value();

            //build context
            const findOne = context.findOne? Builder(FindOne)
                                                .predicate(await provider.schemaMatchResolver.execute({ context: context.findOne, ...options }))
                                                .build() : null;

            const opContext = Builder(Op)
                                .name(_last(context.type.split("/")))
                                .findOne(findOne)
                                .build()

            //parse template
            return await compileTemplate(path.join(provider.schemaTemplate, `aggregateOps/${opKey}.hbs`), opContext)
        }
    }
}

class Op {
    name;
    findOne;
}

class FindOne {
    predicate;
}
