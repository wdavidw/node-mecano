// Schema
// import definitions from "./schema.json" with { type: "json" };
import { readFile } from "node:fs/promises";
const definitions = JSON.parse(
  await readFile(new URL("./schema.json", import.meta.url), "utf8"),
);

// Action
export default {
  handler: async function ({ config }) {
    const { data: state, $status } = await this.incus.query({
      path: `/1.0/instances/${config.name}/state`,
    });
    return {
      $status: $status,
      state,
    };
  },
  metadata: {
    argument_to_config: "name",
    definitions: definitions,
  },
};
