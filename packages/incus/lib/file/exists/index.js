// Schema
// import definitions from "./schema.json" with { type: "json" };
import { readFile } from "node:fs/promises";
const definitions = JSON.parse(
  await readFile(new URL("./schema.json", import.meta.url), "utf8"),
);

// Action
export default {
  handler: async function ({ config }) {
    const { $status } = await this.incus.exec({
      name: config.name,
      command: `test -f ${config.target}`,
      code: [0, 1],
    });
    return {
      exists: $status,
    };
  },
  metadata: {
    definitions: definitions,
    shy: true,
  },
};
