import { Builder } from "builder-pattern";
import { ExecutionArgs, Provider } from "../../def.js";
import _ from "lodash"

/**
* Description placeholder
*/
class CommandDepsTemplateContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandDepsTemplateContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {CommandDepsExecutionArgs} param
    * @returns {Promise<CommandDepsTemplateContext[]>}
    * 
    */
    async execute({ context, ...options }) {

        const repositories = context.repositoryTypes.map(async type => 
                Builder(CommandDepsTemplateContext)
                .type(`IRepository<${await this.provider.typeSchemaResolver.execute({ context: { type, itemType: null }, ...options })}, string>`)
                .name(`${_.camelCase(await this.provider.typeSchemaResolver.execute({ context: { type, itemType: null }, ...options }))}Repository`)
                .build()
          );


        const userContextDep = Builder(CommandDepsTemplateContext)
        .type("IUserContextProvider")
        .name("userContextProvider")
        .build();

        return [userContextDep]
                        .concat(await Promise.all(repositories))
    }
}

export default CommandDepsTemplateContextResolver

/**
* Description placeholder
*/
export class CommandDepsExecutionArgsContext {

    
    /**
     * Description placeholder
     *
     * @type {string[]}
     */
    repositoryTypes
}


/**
* Description placeholder
*/
export class CommandDepsExecutionArgs extends ExecutionArgs
{
    
    /**
     * Description placeholder
     *
     * @type {CommandDepsExecutionArgsContext}
     */
    context
}



/**
* Description placeholder
*/
export class CommandDepsTemplateContext {

    /**
     * Description placeholder
     */
    type

    /**
     * Description placeholder
     */
    name  
}