
using BytLabs.Application.CQS.Commands;
using BytLabs.Application.DataAccess;

public class {{command.name}}Command : ICommand<{{command.returnType}}>
{
    {{#each command.fields}}
        {{>propTemplate this}}
    {{/each}}
}

public class {{command.name}}Handler : ICommandHandler<{{command.name}}Command, {{command.returnType}}>
{
    {{#each command.deps}}
        private readonly {{this.depType}} {{this.depName}};
    {{/each}
    private readonly IConfiguration config;

    public {{command.name}}Handler({{#each command.deps}}
            {{this.depType}} {{this.depName}},
        {{/each}}
        IConfiguration config)
    {
        {{#each command.deps}}
            this.{{this.depName}} = {{this.depName}};
        {{/each}}
        this.config = config;
    }

    public async Task<{{command.returnType}}> Handle({{command.name}}Command request, CancellationToken cancellationToken)
    {
        {{#each command.body}}
            {{this}}
        {{/each}}
    }
}