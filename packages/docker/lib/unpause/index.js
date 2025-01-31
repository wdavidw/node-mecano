// Schema
// import definitions from "./schema.json" with { type: "json" };
import { readFile } from "node:fs/promises";
const definitions = JSON.parse(
  await readFile(new URL("./schema.json", import.meta.url), "utf8"),
);

// Action
export default {
  handler: function ({ config }) {
    this.docker.tools.execute({
      command: `unpause ${config.container}`,
    });
  },
  metadata: {
    global: "docker",
    definitions: definitions,
  },
};
