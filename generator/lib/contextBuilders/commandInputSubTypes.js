import { Builder } from "builder-pattern";
import _ from "lodash";

export default function (opts) {
    return {
        execute: async ({ context, ...options }) => {

            const getSubTypes = async ({ context, boundedContext, classNamePrefix, classes }) => {

                if (context.hasPropertiesOf) {

                    const path = context.hasPropertiesOf.split("/").slice(1).join(".");
                    const inlineClass = _.get(boundedContext, path);
                    _.set(inlineClass, 'name', `${classNamePrefix}_${context.name}`);


                    if (context.except) {
                        inlineClass.properties = _.omit(inlineClass.properties, context.except)
                    }


                    if (context.with) {
                        const nestedOtherClasses = await Promise.all(
                            unwrapObj(context.with)
                                .map(childContext => {
                                    const args = Builder(InnerCommandInputSubTypesArgs)
                                        .context(childContext)
                                        .boundedContext(boundedContext)
                                        .classNamePrefix(inlineClass.name)
                                        .classes([])
                                        .build()
                                    return getSubTypes(args)
                                }));

                        const otherClasses = (_.flatMap(nestedOtherClasses));

                        classes = [...classes, ...otherClasses]

                    }

                    return [...classes, await opts.classContextBuilder.execute({ context: inlineClass, boundedContext })]

                }

                return classes;
            }

            return getSubTypes({ context, ...options })
        }
    }
}

export class CommandInputSubTypesArgs {
    context
    boundedContext
    classNamePrefix
}

class InnerCommandInputSubTypesArgs {
    context
    boundedContext
    classNamePrefix
    classes
}