import _ from "lodash"
import { compileTemplate } from '../utils/utils.js';
import { Builder } from 'builder-pattern';
import path from "path"

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            if(!options.domainObject && !options.domainObject.properties) throw new Error("'mapField' only works with domain objects for field mapping");

            const props = await Promise.all(_.chain(options.domainObject.properties)
                                                .omit(context.omit || [])
                                                .map(async field => await opts.propertyResolver.execute({ context: field.name, ...options }))
                                                .value());

            const invokeContext = Builder(MapFields)
                .source(await opts.variableResolver.execute({ context: context.from, ...options }))
                .props(props)
                .build()

            return await compileTemplate(path.join(opts.templatesDir, `resolvers/mapField.hbs`), invokeContext)
        }
    }
}


class MapFields {
    source
    dest
    props
}


