// Dependencies
import definitions from "./schema.json" assert { type: "json" };

// Action
export default {
  handler: async function({config}) {
    const {storages} = await this.lxc.storage.list()
    return {
      exists: !!storages.find( storage => storage.name === config.name)
    }
  },
  metadata: {
    argument_to_config: 'name',
    definitions: definitions
  }
};
