import { Builder } from "builder-pattern";
import _ from "lodash";
import unwrapObj from "../../../utils/unwrapObj.js";
import { ExecutionArgs, Provider } from "../../def.js";
import { pascalCase } from "change-case";
import { CommandTemplateExecutionArgsContextInputProperty } from "./CommandTemplateContextResolver.js";
import { CommandInputClassExecutionArgsContext, CommandInputClassTemplateContext } from "./CommandInputClassTemplateContextResolver.js";


/**
* Description placeholder
*/
class CommandInputSubTypesTemplateContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandInputSubTypesTemplateContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {CommandInputSubTypesExecutionArgs} param
    * @returns {Promise<CommandInputClassTemplateContext[]>}
    * 
    */
    async execute({ context, ...options }) {

        /**
         * Description placeholder
         *
         * @async
         * @param {GetSubTypesArgs} param
         * @returns {Promise<CommandInputClassTemplateContext[]>}
         */
        const getSubTypes = async ({ context, boundedContext, classNamePrefix, classes }) => {

            /**
             * Description placeholder
             *
             * @param {Object<string, CommandTemplateExecutionArgsContextInputProperty>} obj
             * @returns {(CommandTemplateExecutionArgsContextInputProperty & { name: string })[]}
             */
            const unwrapWith = (obj) => {
                return unwrapObj(obj)
            }

            if (context.hasPropertiesOf) {

                const path = context.hasPropertiesOf.split("/").slice(1).join(".");
                const inlineClass = _.get(boundedContext, path);
                _.set(inlineClass, 'name', `${classNamePrefix}_${context.name}`);


                if (context.except) {
                    inlineClass.properties = _.omit(inlineClass.properties, context.except)
                }


                if (context.with) {
                    const nestedOtherClasses = await Promise.all(
                        unwrapWith(context.with)
                            .map(childContext => {
                                if (childContext.hasPropertiesOf) {
                                    return getSubTypes(
                                                        Builder(GetSubTypesArgs)
                                                            .context(childContext)
                                                            .boundedContext(boundedContext)
                                                            .classNamePrefix(pascalCase(context.name))
                                                            .classes([])
                                                            .build()
                                                        )
                                }

                                return null;
                                    
                            })
                            .filter(classes=> !!classes)
                        );

                    const otherClasses = (_.flatMap(nestedOtherClasses));

                    classes = [...classes, ...otherClasses]

                }

                var classContext = Builder(CommandInputClassExecutionArgsContext)
                    .name(inlineClass.name)
                    .properties(inlineClass.properties)
                    .build();

                return [...classes, await this.provider.commandInputTypeContextResolver.execute({ context: classContext, ...options })]

            }

            return classes;
        }

        return getSubTypes({ context, classNamePrefix: pascalCase(options.command.name), classes: [], ...options })
    }
}

export default CommandInputSubTypesTemplateContextResolver

/**
* Description placeholder
*/


/**
* Description placeholder
*/
export class CommandInputSubTypesExecutionArgs extends ExecutionArgs {


    /**
     * Description placeholder
     *
     * @type {CommandTemplateExecutionArgsContextInputProperty & { name: string} }
     */
    context
}


/**
* Description placeholder
*/
class GetSubTypesArgs {


    /**
     * Description placeholder
     *
     * @type {CommandTemplateExecutionArgsContextInputProperty & { name: string}}
     */
    context


    /**
     * Description placeholder
     *
     * @type {*}
     */
    boundedContext


    /**
     * Description placeholder
     *
     * @type {string}
     */
    classNamePrefix


    /**
     * Description placeholder
     *
     * @type {CommandInputClassTemplateContext[]}
     */
    classes
}