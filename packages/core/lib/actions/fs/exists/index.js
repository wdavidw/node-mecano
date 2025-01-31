// Schema
// import definitions from "./schema.json" with { type: "json" };
import { readFile } from "node:fs/promises";
const definitions = JSON.parse(
  await readFile(new URL("./schema.json", import.meta.url), "utf8"),
);

// Action
export default {
  handler: async function ({ config }) {
    try {
      await this.fs.stat({
        target: config.target,
        dereference: true,
      });
      return {
        exists: true,
        target: config.target,
      };
    } catch (error) {
      if (error.code === "NIKITA_FS_STAT_TARGET_ENOENT") {
        return {
          exists: false,
          target: config.target,
        };
      } else {
        throw error;
      }
    }
  },
  metadata: {
    argument_to_config: "target",
    log: false,
    raw_output: true,
    definitions: definitions,
  },
};
