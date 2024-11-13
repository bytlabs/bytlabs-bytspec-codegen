import { pascalCase } from "change-case";
import { Builder } from "builder-pattern";
import { Provider, ExecutionArgs } from "./../../def.js"
import { CommandDepsTemplateContext } from "./CommandDepsTemplateContextResolver.js";
import unwrapObj from "../../../utils/unwrapObj.js";
import _ from "lodash"

/**
* Description placeholder
*/
class CommandTemplateContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandTemplateContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {CommandTemplateExecutionArgs} param
    * @returns {Promise<CommandTemplateContext>}
    * 
    */
    async execute({ context, ...options }) {

        /**
         * Description placeholder
         *
         * @param {Object<string, CommandTemplateExecutionArgsContextInputProperty>} obj
         * @returns {(CommandTemplateExecutionArgsContextInputProperty & { name: string })[]}
         */
        const unwrapWith = (obj) => {
            return unwrapObj(obj)
        }

        const getSubTypes = async () => {
            _.flatMap(await Promise.all(
                unwrapWith(context.input)
                    .map(async field => {

                        if (field.hasPropertiesOf) {

                            const subTypes = await this.provider.commandInputSubTypesTemplateContextResolver.execute({ context: field, ...options })

                            return subTypes;
                        }

                        return []
                    })
            ))
        }



        const repositoryTypes = _.chain(context.execute)
            .filter(op => op.aggregate || (op.let && op.let.aggregate))
            .map(op => op.aggregate ? op.aggregate.type : op.let.aggregate.type)
            .uniq()
            .value()


        return Builder(CommandTemplateContext)
            .project(Builder(ProjectTemplateContext)
                .name(pascalCase(options.boundedContext.name))
                .build())
            .context(Builder(CommandTemplateContextContext)
                .name(pascalCase(context.name))
                .fields(await this.provider.commandInputTemplateContextResolver.execute({ context: context.input, ...options }))
                .subTypes(await getSubTypes())
                .returnType(context.returns ? await this.provider.typeSchemaResolver.execute({ context: { type: context.returns, itemType: null }, command: context, ...options }) : null)
                .body(await this.provider.commandExecuteTemplateContextResolver.execute({ context: context.execute, command: context, ...options }))
                .deps(await this.provider.commandDepsTemplateContextResolver.execute({ context: { repositoryTypes }, command: context, ...options }))
                .build())
            .build()

    }
}

export default CommandTemplateContextResolver


/**
* Description placeholder
*/
export class CommandTemplateExecutionArgsContext {


    /**
     * Description placeholder
     *
     * @type {*}
     */
    execute


    /**
     * Description placeholder
     *
     * @type {string}
     */
    name



    /**
     * Description placeholder
     *
     * @type {Object<string, CommandTemplateExecutionArgsContextInputProperty>}
     */
    input


    /**
     * Description placeholder
     *
     * @type {string}
     */
    returns

}

/**
* Description placeholder
*/
export class CommandTemplateExecutionArgsContextInputProperty {


    /**
     * Description placeholder
     *
     * @type {string}
     */
    hasPropertiesOf


    /**
     * Description placeholder
     *
     * @type {string[]}
     */
    except


    /**
     * Description placeholder
     *
     * @type {Object<string, CommandTemplateExecutionArgsContextInputProperty>}
     */
    with


    /**
     * Description placeholder
     *
     * @type {string | undefined}
     */
    type

    /**
     * Description placeholder
     *
     * @type {string | undefined}
     */
    items
}


/**
* Description placeholder
*/
export class CommandTemplateExecutionArgs extends ExecutionArgs {


    /**
     * Description placeholder
     *
     * @type {CommandTemplateExecutionArgsContext}
     */
    context
}


/**
* Description placeholder
*/
class CommandTemplateContext {


    /**
     * Description placeholder
     *
     * @type {ProjectTemplateContext}
     */
    project


    /**
     * Description placeholder
     *
     * @type {CommandTemplateContextContext}
     */
    context
}


/**
* Description placeholder
*/
class ProjectTemplateContext {

    /**
     * Description placeholder
     *
     * @type {string}
     */
    name
}

class CommandTemplateContextField {

    /**
     * Description placeholder
     *
     * @type {string}
     */
    name


    /**
     * Description placeholder
     *
     * @type {string}
     */
    type


    /**
     * Description placeholder
     *
     * @type {string}
     */
    default
}


/**
 * Description placeholder
 */
export class CommandTemplateContextContext {


    /**
     * Description placeholder
     *
     * @type {string}
     */
    name


    /**
     * Description placeholder
     *
     * @type {CommandTemplateContextField[]}
     */
    fields


    /**
     * Description placeholder
     *
     * @type {*}
     */
    subTypes

    returnType
    body


    /**
     * Description placeholder
     *
     * @type {CommandDepsTemplateContext[]}
     */
    deps
}

