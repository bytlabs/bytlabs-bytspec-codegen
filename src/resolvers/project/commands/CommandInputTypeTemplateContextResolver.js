import { Builder } from "builder-pattern";
import { pascalCase } from "change-case";
import { ExecutionArgs, Provider } from "../../def.js";
import unwrapObj from "../../../utils/unwrapObj.js";

/**
* Description placeholder
*/
class CommandInputTypeContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandInputTypeContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {ExecutionArgs} param
    * @returns {Promise<>}
    * 
    */
    async execute({ context, ...options }) {
        const project = Builder(CommandInputTypeTemplateContextProject)
            .name(pascalCase(options.boundedContext.name))
            .build();

        const properties = await Promise.all(unwrapObj(context.properties || {})
            .map(async field =>
                Builder(CommandInputTypeTemplateContextClassProperty)
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

        const $class = Builder(CommandInputTypeTemplateContextClass)
            .name(pascalCase(context.name))
            .properties(properties)
            .build();

        return Builder(CommandInputTypeTemplateContext)
            .project(project)
            .class($class)
            .build();
    }
}

export default CommandInputTypeContextResolver



/**
* Description placeholder
*/
export class CommandInputTypeTemplateContext {

    
    /**
     * Description placeholder
     *
     * @type {CommandInputTypeTemplateContextProject}
     */
    project

    
    /**
     * Description placeholder
     *
     * @type {CommandInputTypeTemplateContextClass}
     */
    class
}

/**
* Description placeholder
*/
export class CommandInputTypeTemplateContextProject {

    
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
export class CommandInputTypeTemplateContextClass {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    name;

    
    /**
     * Description placeholder
     *
     * @type {CommandInputTypeTemplateContextClassProperty[]}
     */
    properties
}

/**
* Description placeholder
*/
export class CommandInputTypeTemplateContextClassProperty {

    
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