import _ from "lodash"
import { compileTemplate } from './utils';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            const opKey = _.chain(context)
                                .pick(['findOne'])   
                                .keys()              
                                .first()
                                .value();

            //build context
            const findOne = context.findOne? Builder(FindOne)
                                                .predicate(await opts.matchResolver.execute({ context: context.findOne, ...options }))
                                                .build() : null;

            const opContext = Builder(Op)
                                .name(_last(context.type.split("/")))
                                .findOne(findOne)
                                .build()

            //parse template
            return await compileTemplate(path.join(opts.templatesDir, `resolvers/aggregateOps/${opKey}.hbs`), opContext)
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
