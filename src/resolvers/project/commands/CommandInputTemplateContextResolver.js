import { Builder } from "builder-pattern";
import unwrapObj from "../../../utils/unwrapObj.js";
import { ExecutionArgs, Provider } from "../../def.js";
import { pascalCase } from "change-case";

/**
* Description placeholder
*/
class CommandInputTemplateContextResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of CommandInputTemplateContextResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {CommandInputExecutionArgs} param
    * @returns {Promise<string[]>}
    * 
    */
    async execute({ context, ...options }) {
        return await Promise.all(unwrapObj(context)
                .map(async field => {

                    let type = null;

                    if (field.hasPropertiesOf) {

                        const args = Builder(CommandSubTypesArgs)
                            .field(field)
                            .boundedContext(boundedContext)
                            .classNamePrefix(context.name)
                            .classes([])
                            .build();

                        const subTypes = await this.provider.commandInputTypesTemplateContextResolver.execute(args)

                        type = _.last(subTypes).class.name;
                    }
                    else {
                        type = await provider.schemaTypeResolver.execute({ context: { type: field.type, items: field.items } })
                    }

                    return {
                        type: type,
                        name: pascalCase(field.name),
                        default: await provider.schemaDefaultValueResolver.execute({ context: { type } }),
                    }
                }))
    }
}

export default CommandInputTemplateContextResolver

export class CommandInputExecutionArgs extends ExecutionArgs {
    context
}

