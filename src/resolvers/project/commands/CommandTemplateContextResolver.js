import { pascalCase } from "change-case";
import { Builder } from "builder-pattern";
import { Provider, ExecutionArgs } from "./../../def.js"
import { CommandDepsTemplateContext } from "./CommandDepsTemplateContextResolver.js";
import unwrapObj from "../../../utils/unwrapObj.js";
import _ from "lodash"
import { CommandInputPropertyTemplateContext } from "./CommandInputTemplateContextResolver.js";
import { CommandInputClassTemplateContext } from "./CommandInputClassTemplateContextResolver.js";
import { CommandInputSubTypesExecutionArgsInputProperty } from "./CommandInputSubTypesTemplateContextResolver.js";

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
         * @param {Object<string, CommandInputSubTypesExecutionArgsInputProperty>} obj
         * @returns {(CommandInputSubTypesExecutionArgsInputProperty & { name: string })[]}
         */
        const unwrapWith = (obj) => {
            return unwrapObj(obj)
        }

        const getSubTypes = async () => {
            return _.flatMap(await Promise.all(
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
                .properties(await this.provider.commandInputPropertyTemplateContextResolver.execute({ context: context.input, ...options }))
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
     * @type {Object<string, CommandInputSubTypesExecutionArgsInputProperty>}
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
     * @type {CommandInputPropertyTemplateContext[]}
     */
    properties


    /**
     * Description placeholder
     *
     * @type {CommandInputClassTemplateContext[]}
     */
    subTypes

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    returnType

    
    /**
     * Description placeholder
     *
     * @type {string[]}
     */
    body


    /**
     * Description placeholder
     *
     * @type {CommandDepsTemplateContext[]}
     */
    deps
}

