import { pascalCase } from "change-case";
import path from "path"
import { ExecutionArgs, FileResolverArgs, Provider } from "../../def.js";
import unwrapObj from "../../../utils/unwrapObj.js";
import parseTemplateWithPath from "../../../utils/parseTemplateWithPath.js";
import { EntitySchema } from "../../../schema.js";




/**
* Description placeholder
*/
class EntitiesFileResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of EntitiesFileResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {FileResolverArgs} param
    * @returns {Promise}
    * 
    */
    async execute({ spec, outputDirectory }) {
        const sourceDirectory = this.provider.projectTemplate;

        for (let boundedContext of unwrapObj(spec.boundedContexts)) {

            const templatesData = await Promise.all(unwrapObj(boundedContext.domain.entities)
            .map(async entity => await this.getClassTemplateData({ context: entity, boundedContext, domainObject: null, command: null, isEntity: true })))

            for (let templateData of templatesData) {
                const destinationDirectory = path.join(outputDirectory, templateData.project.name);
                await parseTemplateWithPath(sourceDirectory, destinationDirectory, ".entity.cs", templateData);
            }
        }
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {{context: (EntitySchema & { name: string})} & ExecutionArgs & { isEntity: boolean}} param
    * @returns {Promise<Object>}
    * 
    */
    async getClassTemplateData ({context, ...options}) {
        const projectName = pascalCase(options.boundedContext.name);
        const className = pascalCase(context.name);
    
        const properties = unwrapObj(context.properties || {})
            .map(field => ({
                type: this.provider.typeSchemaResolver.execute({ ...field, boundedContext: options.boundedContext, domainObject: context, command: null}),
                name: pascalCase(field.name),
                default: this.provider.typeDefaultSchemaResolver.execute({ context: field, boundedContext: options.boundedContext, domainObject: context, command: null}),
            }))
    
        let methods = [];
    
        if (context.actions) {
            methods = await Promise.all(unwrapObj(context.actions)
            .map(async method => ({
                name: pascalCase(method.name),
                type: "void",
                parameters: await Promise.all(unwrapObj(method.parameters)
                .map(async param => ({ name: param.name, type: await this.provider.typeSchemaResolver.execute({ context: param, boundedContext: options.boundedContext, domainObject: context, command: null}) }))),
                body: method.execute.map(line => this.provider.opSchemaResolver.execute({ context: line, boundedContext: options.boundedContext, domainObject: context, command: null }))
            })))
        }
    
        return {
            project: {
                name: projectName
            },
            class: {
                name: className,
                properties: options.isEntity ? properties.filter(x => x.name != "Id") : properties,
                methods: methods,
                aggregate: context.aggregate,
                idType: options.isEntity ? properties.find(x => x.name == "Id")?.type : null
            }
        };
    }
    
}

export default EntitiesFileResolver

