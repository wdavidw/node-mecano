// Dependencies
import definitions from "./schema.json" assert { type: "json" };

// Action
export default {
  handler: async function({config}) {
    const {$status, data} = await this.lxc.query({
      path: `/1.0/storage-pools/${config.pool}/volumes/${config.type}/${config.name}`,
      code: [0, 1]
    });
    return {
      $status: $status,
      data: data
    };
  },
  metadata: {
    definitions: definitions,
    shy: true
  }
};
