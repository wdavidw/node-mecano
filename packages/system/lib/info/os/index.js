// Dependencies
const utils = require("../../utils");
const definitions = require("./schema.json");

// Action
module.exports = {
  handler: async function () {
    // Using `utils.os.command` to be consistant with OS conditions plugin in core
    const { stdout } = await this.execute(utils.os.command);
    const [arch, distribution, version, linux_version] = stdout.split("|");
    return {
      os: {
        arch: arch,
        distribution: distribution,
        version: version.length ? version : void 0, // eg Arch Linux
        linux_version: linux_version,
      },
    };
  },
  metadata: {
    definitions: definitions,
    shy: true,
  },
};
