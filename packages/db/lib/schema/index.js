// Dependencies
import { db } from "@nikitajs/db/utils";
// Schema
// import definitions from "./schema.json" with { type: "json" };
import { readFile } from "node:fs/promises";
const definitions = JSON.parse(
  await readFile(new URL("./schema.json", import.meta.url), "utf8"),
);

// Action
export default {
  handler: async function ({ config }) {
    const { $status } = await this.execute({
      $shy: true,
      code: [0, 2],
      command: db.command(config, "\\dt"),
    });
    if (!$status) {
      throw Error(`Database does not exist ${config.database}`);
    }
    await this.db.query({
      ...db.connection_config(config),
      command: `CREATE SCHEMA ${config.schema};`,
      $unless_execute:
        db.command(
          config,
          `SELECT 1 FROM pg_namespace WHERE nspname = '${config.schema}';`,
        ) + " | grep 1",
    });
    // Check if owner is the good one
    const { stderr } = await this.execute({
      $if: config.owner != null,
      $unless_execute:
        db.command(config, "\\dn") +
        ` | grep '${config.schema}|${config.owner}'`,
      command: db.command(
        config,
        `ALTER SCHEMA ${config.schema} OWNER TO ${config.owner};`,
      ),
      code: [0, 1],
    });
    if (/^ERROR:\s\srole.*does\snot\sexist/.test(stderr)) {
      throw Error(`Owner ${config.owner} does not exists`);
    }
  },
  metadata: {
    global: "db",
    definitions: definitions,
  },
};
