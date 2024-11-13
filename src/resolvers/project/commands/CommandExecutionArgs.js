import { CommandSchema, EntitySchema } from "../../../schema.js"
import { ExecutionArgs } from "../../def.js"

/**
* Description placeholder
*/
export class CommandExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {CommandSchema & { name:string}}
     */
    context
}

/**
* Description placeholder
*/
export class CommandExecutionArgsSubType extends EntitySchema {

    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    name
}



export class CommandExecutionArgsDeps {

    
    /**
     * Description placeholder
     *
     * @type {string[]}
     */
    repositoryTypes
}
