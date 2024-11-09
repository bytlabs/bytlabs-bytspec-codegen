
import Handlebars from "handlebars"

const aggregateSource = `
var {{aggregate.name}} = {{aggregate.op}};
{{#each aggregate.actions}}
{{aggregate.name}}.{{this.name}}({{#each this.parameters}}{{this}}{{#unless @last}},{{/unless}}{{/each}})
{{/each}}
`;

class AggregateAction {
    constructor(name, parameters) {
        this.name = name;
        this.parameters = parameters
    }
}

class AggregateContext {
    constructor(name, op, actions) {
        this.name = name;
        this.op = op;
        this.actions = actions
    }

}

const compileTemplate = (source, context) => {
    const template = Handlebars.compile(source);
    const content = template(context);
    return content;
}



export default function (opts) {
    return {
        execute: ({ context }) => {

            const chance = new Chance();
            const randomName = chance.word({ syllables: 3 })
            const actions = context.actions
                    .map(action => new AggregateAction(
                        opts.resolverAggregateAction(action.name), 
                        opts.resolverVariable(action.parameters)));

            const aggregateContext = new AggregateContext(randomName, opts.resolverAggregateOp(context), actions)
            return compileTemplate(aggregateSource, aggregateContext)

        }
    }
}


