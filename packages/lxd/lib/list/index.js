
// Dependencies
import definitions from "./schema.json" assert { type: "json" };

// ## Exports
export default {
  handler: async function({config}) {
    const {data} = (await this.lxc.query({
      $shy: false,
      path: `/1.0/${config.filter}`
    }));
    return {
      list: data.map(line => line.split('/').pop())
    };
  },
  metadata: {
    definitions: definitions,
    shy: true
  }
};
