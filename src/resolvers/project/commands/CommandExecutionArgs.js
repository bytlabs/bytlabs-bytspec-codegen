import { ExecutionArgs } from "../../def.js"

/**
* Description placeholder
*/
export class CommandExecutionArgs extends ExecutionArgs {

    
    /**
     * Description placeholder
     *
     * @type {CommandExecutionArgsContext}
     */
    context
}

/**
* Description placeholder
*/
export class CommandExecutionArgsContext  {


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
     * @type {Object<string, CommandExecutionArgsInputProperty>}
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
export class CommandExecutionArgsInputProperty {


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
     * @type {Object<string, CommandExecutionArgsInputProperty>}
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

export class CommandExecutionArgsSubType {

    
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

export class CommandExecutionArgsDeps {

    
    /**
     * Description placeholder
     *
     * @type {string[]}
     */
    repositoryTypes
}
