import { pascalCase } from "change-case";
import { Builder } from "builder-pattern";
import { CommandSubTypesArgs } from "./CommandInputTypesTemplateContextResolver.js";
import { Provider, ExecutionArgs } from "./../../def.js"
import { CommandDepsTemplateContext } from "./CommandDepsTemplateContextResolver.js";

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
    * @param {*} param
    * @returns {CommandTemplateContext}
    * 
    */
    async execute({ context, ...options }) {

            


            const subTypes = _.flatMap(fields, field => field.subTypes);

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
                                    .fields(fields)
                                    .subTypes(subTypes)
                                    .returnType(context.returns ? await this.provider.typeSchemaResolver.execute({ context: context.returns, command: context, ...options }) : null)
                                    .body(await this.provider.commandExecuteTemplateContextResolver.execute({ context: context.execute, command: context, ...options}))
                                    .deps(await this.provider.commandDepsTemplateContextResolver.execute({ context: { repositoryTypes }, command: context, ...options }))
                                    .build())
                        
    }
}

export default CommandTemplateContextResolver

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
class ProjectTemplateContext
{
    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    name
}

class CommandTemplateContextField
{
    
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

