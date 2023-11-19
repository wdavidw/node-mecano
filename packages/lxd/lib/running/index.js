// Dependencies
import definitions from "./schema.json" assert { type: "json" };

// Action
export default {
  handler: async function({config}) {
    return await this.execute({
      command: `lxc list -c ns --format csv | grep '${config.container},RUNNING' || exit 42`,
      code: [0, 42]
    });
  },
  metadata: {
    argument_to_config: 'container',
    definitions: definitions,
    shy: true
  }
};
