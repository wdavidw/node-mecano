// Generated by CoffeeScript 2.5.1
// # `nikita.ipa.service.del`

// Delete a service from FreeIPA.

// ## Options

// * `principal` (string, required)   
//   Name of the user to delete, same as the username.
// * `connection` (object, required)   
//   See the `nikita.connection.http` action.

// ## Exemple

// ```js
// require("nikita")
// .ipa.service.del({
//   principal: "myprincipal/my.domain.com",
//   connection: {
//     url: "https://ipa.domain.com/ipa/session/json",
//     principal: "admin@DOMAIN.COM",
//     password: "mysecret"
//   }
// }, function(){
//   console.info(err ? err.message : status ?
//     "Service deleted" : "Service does not exist")
// })
// ```

// ## Schema
var diff, handler, schema, string;

schema = {
  type: 'object',
  properties: {
    'principal': {
      type: 'string'
    },
    'connection': {
      $ref: '/nikita/connection/http'
    }
  },
  required: ['connection', 'principal']
};

// ## Handler
handler = function({options}) {
  var base, base1;
  if ((base = options.connection).http_headers == null) {
    base.http_headers = {};
  }
  if ((base1 = options.connection.http_headers)['Referer'] == null) {
    base1['Referer'] = options.connection.referer || options.connection.url;
  }
  if (!options.connection.principal) {
    throw Error(`Required Option: principal is required, got ${options.connection.principal}`);
  }
  if (!options.connection.password) {
    throw Error(`Required Option: password is required, got ${options.connection.password}`);
  }
  this.ipa.service.exists({
    connection: options.connection,
    shy: false,
    principal: options.principal
  });
  return this.connection.http(options.connection, {
    if: function() {
      return this.status(-1);
    },
    negotiate: true,
    method: 'POST',
    data: {
      method: "service_del/1",
      params: [[options.principal], {}],
      id: 0
    },
    http_headers: options.http_headers
  });
};

// ## Export
module.exports = {
  handler: handler,
  schema: schema
};

// ## Dependencies
string = require('@nikitajs/core/lib/misc/string');

diff = require('object-diff');
