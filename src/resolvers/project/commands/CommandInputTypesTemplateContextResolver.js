import { Builder } from "builder-pattern";
import _ from "lodash";
import unwrapObj from "../../../utils/unwrapObj.js";
import { Provider } from "../../def.js";

/**
* Description placeholder
*/
class CommandInputTypesTemplateContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandInputTypesTemplateContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {CommandInputTypesExecutionArgs} param
    * @returns {Promise<Object[]>}
    * 
    */
    async execute({ context, ...options }) {
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
                                const args = Builder(InnerCommandSubTypesArgs)
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

                return [...classes, await this.provider.commandInputTypeContextResolver.execute({ context: inlineClass, boundedContext })]

            }

            return classes;
        }

        return getSubTypes({ context, ...options })
    }
}

export default CommandInputTypesTemplateContextResolver

export class CommandInputTypesExecutionArgsContext {

}

/**
* Description placeholder
*/
export class CommandInputTypesExecutionArgs {
    
    
    /**
     * Description placeholder
     *
     * @type {CommandInputTypesExecutionArgsContext}
     */
    context
}

export class CommandSubTypesArgs {
    context
    boundedContext
    classNamePrefix
}

class InnerCommandSubTypesArgs {
    context
    boundedContext
    classNamePrefix
    classes
}