// Generated by CoffeeScript 2.7.0
// # `nikita.db.database.exists`

// Check if a database exists.

// ## Schema definitions
var definitions, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      'admin_username': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/admin_username'
      },
      'admin_password': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/admin_password'
      },
      'database': {
        type: 'string',
        description: `The database name to check for existance.`
      },
      'engine': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/engine'
      },
      'host': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/host'
      },
      'port': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/port'
      }
    },
    required: ['admin_username', 'admin_password', 'database', 'engine', 'host']
  }
};

// ## Handler
handler = async function({config}) {
  var $status;
  ({$status} = (await this.db.query(config, {
    command: (function() {
      switch (config.engine) {
        case 'mariadb':
        case 'mysql':
          return 'SHOW DATABASES';
        case 'postgresql':
          // Not sure why we're not using \l
          return `SELECT datname FROM pg_database WHERE datname = '${config.database}'`;
      }
    })(),
    database: null,
    grep: config.database
  })));
  return {
    exists: $status
  };
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    argument_to_config: 'database',
    global: 'db',
    shy: true,
    definitions: definitions
  }
};
