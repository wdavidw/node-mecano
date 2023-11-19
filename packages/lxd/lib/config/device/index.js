// Dependencies
import diff from 'object-diff';
import utils from "@nikitajs/lxd/utils";
import { escapeshellarg as esa } from "@nikitajs/core/utils/string";
import definitions from "./schema.json" assert { type: "json" };

// Action
export default {
  handler: async function({config}) {
    // No properties, dont go further
    if (Object.keys(config.properties).length === 0) return false;
    // Normalize config
    for (const key in config.properties) {
      const value = config.properties[key]
      if (typeof property === 'string') {
        continue;
      }
      config.properties[key] = value.toString();
    }
    const {properties} = await this.lxc.config.device.show({
      container: config.container,
      device: config.device
    });
    try {
      if (!properties) {
        // Device not registered, we need to use `add`
        await this.execute({
          command: [
            "lxc",
            "config",
            "device",
            "add",
            config.container,
            config.device,
            config.type,
            ...Object.keys(config.properties).map(
              (key) =>
                esa(key) +
                "=" +
                esa(config.properties[key])
            ),
          ].join(" "),
        });
        return true;
      } else {
        // Device registered, we need to use `set`
        const changes = diff(properties, config.properties);
        if (Object.keys(changes).length === 0) return false;
        for (const key in changes) {
          const value = changes[key];
          await this.execute({
            command: [
              "lxc",
              "config",
              "device",
              "set",
              config.container,
              config.device,
              key,
              esa(value),
            ].join(" "),
          });
        }
        return true;
      }
    } catch (error) {
      utils.stderr_to_error_message(error, error.stderr);
      throw error;
    }
  },
  metadata: {
    definitions: definitions
  }
};
