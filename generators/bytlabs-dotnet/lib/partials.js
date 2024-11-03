import Handlebars from "handlebars"

Handlebars.registerPartial("methodTemplate", `
public {{type}} {{name}}({{#each parameters}}{{type}} {{name}}{{#unless @last}}, {{/unless}}{{/each}})
{
    {{#each body}}
    {{this}}
    {{/each}}
}
`);

Handlebars.registerPartial("fieldTemplate", `
public {{{type}}} {{name}} { get; set; }
`);
