import { Builder } from "builder-pattern";
import { pascalCase } from "change-case";
import { ExecutionArgs, Provider } from "../../def.js";
import unwrapObj from "../../../utils/unwrapObj.js";

/**
* Description placeholder
*/
class CommandInputClassTemplateContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandInputClassContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {CommandInputClassExecutionArgs} param
    * @returns {Promise<CommandInputClassTemplateContext>}
    * 
    */
    async execute({ context, ...options }) {
        const project = Builder(CommandInputClassTemplateContextProject)
            .name(pascalCase(options.boundedContext.name))
            .build();

        const properties = await Promise.all(unwrapObj(context.properties || {})
            .map(async field =>
                Builder(CommandInputClassTemplateContextClassProperty)
                    .type(await this.provider.typeSchemaResolver.execute({
                        context: field,
                        domainObject: context,
                        ...options
                    }))
                    .name(pascalCase(field.name))
                    .default(await this.provider.typeDefaultSchemaResolver.execute({
                        context: field,
                        domainObject: context,
                        ...options
                    }))
                    .build()
            ))

        const $class = Builder(CommandInputClassTemplateContextClass)
            .name(pascalCase(context.name))
            .properties(properties)
            .build();

        return Builder(CommandInputClassTemplateContext)
            .project(project)
            .class($class)
            .build();
    }
}

export default CommandInputClassTemplateContextResolver

/**
* Description placeholder
*/
export class CommandInputClassExecutionArgsContext {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    name

    /**
     * Description placeholder
     *
     * @type {Object<string, { type: string, itemType: string }>}
     */
    properties

}

/**
* Description placeholder
*/
export class CommandInputClassExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {CommandInputClassExecutionArgsContext}
     */
    context
}

/**
* Description placeholder
*/
export class CommandInputClassTemplateContext {

    
    /**
     * Description placeholder
     *
     * @type {CommandInputClassTemplateContextProject}
     */
    project

    
    /**
     * Description placeholder
     *
     * @type {CommandInputClassTemplateContextClass}
     */
    class
}

/**
* Description placeholder
*/
export class CommandInputClassTemplateContextProject {

    
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
export class CommandInputClassTemplateContextClass {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    name;

    
    /**
     * Description placeholder
     *
     * @type {CommandInputClassTemplateContextClassProperty[]}
     */
    properties
}

/**
* Description placeholder
*/
export class CommandInputClassTemplateContextClassProperty {

    
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
    name

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    default
}