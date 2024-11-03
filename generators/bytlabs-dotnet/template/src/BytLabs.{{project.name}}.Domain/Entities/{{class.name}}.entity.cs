using System;
using System.Collections.Generic;

namespace BytLabs.{{project.name}}.Domain.Entities
{
    public class {{class.name}}
    {
        {{#each class.fields}}
            {{>propTemplate this}}
        {{/each}}

        {{#each class.methods}}
            {{>methodTemplate this}}
        {{/each}}
    }
}
