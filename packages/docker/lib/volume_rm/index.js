
// Dependencies
import definitions from "./schema.json" with { type: "json" };

// Action
export default {
  handler: async function({config}) {
    await this.docker.tools.execute({
      command: `volume rm ${config.name}`,
      code: [0, 1]
    });
  },
  metadata: {
    global: 'docker',
    definitions: definitions
  }
};
