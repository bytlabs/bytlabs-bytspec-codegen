using BytLabs.Application.CQS.Commands;

namespace BytLabs.{{project.name}}.Application
{
    public class {{command.name}}Command : ICommand
    {
        {{#each command.fields}}
        public $this.type $this.name { get; set;  }
        {{/each}}
    }
}
