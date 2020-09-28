// Generated by CoffeeScript 2.5.1
// # `nikita.docker.load`

// Load Docker images.

// ## Options

// * `boot2docker` (boolean)   
//   Whether to use boot2docker or not, default to false.
// * `machine` (string)   
//   Name of the docker-machine, required if using docker-machine.
// * `input` (string)   
//   TAR archive file to read from.
// * `source` (string)   
//   Alias for the "input" option.
// * `checksum` (string)   
//   If provided, will check if attached input archive to checksum already exist,
//   not native to docker but implemented to get better performance.

// ## Callback parameters

// * `err`   
//   Error object if any.
// * `status`   
//   True if container was loaded.
// * `stdout`   
//   Stdout value(s) unless `stdout` option is provided.
// * `stderr`   
//   Stderr value(s) unless `stderr` option is provided.

// ## Example

// ```javascript
// require('nikita')
// .docker.load({
//   image: 'nikita/load_test:latest',
//   machine: machine,
//   source: source + "/nikita_load.tar"
// }, function(err, {status}) {
//   console.log( err ? err.message : 'Container loaded: ' + status);
// })
// ```

// ## Schema
var docker, handler, schema, string, util;

schema = {
  type: 'object',
  properties: {}
};

// ## Handler
handler = function({
    config,
    log,
    operations: {find}
  }) {
  var cmd, images, k, ref, v;
  log({
    message: "Entering Docker load",
    level: 'DEBUG',
    module: 'nikita/lib/docker/load'
  });
  // Global config
  if (config.docker == null) {
    config.docker = {};
  }
  ref = config.docker;
  for (k in ref) {
    v = ref[k];
    if (config[k] == null) {
      config[k] = v;
    }
  }
  // Validate parameters
  if (config.input == null) {
    config.input = config.source;
  }
  if (config.input == null) {
    return callback(Error('Missing input parameter'));
  }
  cmd = `load -i ${config.input}`;
  // need to records the list of image to see if status is modified or not after load
  // for this we print the existing images as REPOSITORY:TAG:IMAGE
  // parse the result to record images as an array of   {'REPOSITORY:TAG:'= 'IMAGE'}
  images = {};
  delete config.cmd;
  log({
    message: 'Storing previous state of image',
    level: 'INFO',
    module: 'nikita/lib/docker/load'
  });
  if (config.checksum == null) {
    log({
      message: 'No checksum provided',
      level: 'INFO',
      module: 'nikita/lib/docker/load'
    });
  }
  if (config.checksum) {
    log({
      message: `Checksum provided :${config.checksum}`,
      level: 'INFO',
      module: 'nikita/lib/docker/load'
    });
  }
  if (config.checksum == null) {
    config.checksum = '';
  }
  return this.execute({
    cmd: docker.wrap(config, " images | grep -v '<none>' | awk '{ print $1\":\"$2\":\"$3 }'")
  }, (err, {stdout}) => {
    var i, image, infos, len, ref1;
    if (err) {
      return callback(err);
    }
    // skip header line, wi skip it here instead of in the grep  to have
    // an array with at least one not empty line
    if (string.lines(stdout).length > 1) {
      ref1 = string.lines(stdout);
      for (i = 0, len = ref1.length; i < len; i++) {
        image = ref1[i];
        image = image.trim();
        if (image !== '') {
          infos = image.split(':');
          if (infos[2] === config.checksum) {
            // if image is here we skip
            log({
              message: `Image already exist checksum :${config.checksum}, repo:tag ${`${infos[0]}:${infos[1]}`}`,
              level: 'INFO',
              module: 'nikita/lib/docker/load'
            });
          }
          if (infos[2] === config.checksum) {
            return callback(null, false);
          }
          images[`${infos[0]}:${infos[1]}`] = `${infos[2]}`;
        }
      }
    }
    log({
      message: `Start Loading ${config.input} `,
      level: 'INFO',
      module: 'nikita/lib/docker/load'
    });
    this.execute({
      cmd: docker.wrap(config, cmd)
    });
    return this.execute({
      cmd: docker.wrap(config, 'images | grep -v \'<none>\' | awk \'{ print $1":"$2":"$3 }\'')
    }, function(err, {stdout, stderr}) {
      var j, len1, new_image, new_images, new_k, ref2, status;
      if (err) {
        return callback(err);
      }
      new_images = {};
      status = false;
      log({
        message: 'Comparing new images',
        level: 'INFO',
        module: 'nikita/lib/docker/load'
      });
      if (string.lines(stdout).length > 1) {
        ref2 = string.lines(stdout.toString());
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          image = ref2[j];
          if (image !== '') {
            infos = image.split(':');
            new_images[`${infos[0]}:${infos[1]}`] = `${infos[2]}`;
          }
        }
      }
      for (new_k in new_images) {
        new_image = new_images[new_k];
        if (images[new_k] == null) {
          status = true;
          break;
        } else {
          for (k in images) {
            image = images[k];
            if (image !== new_image && new_k === k) {
              status = true;
              log({
                message: 'Identical images',
                level: 'INFO',
                module: 'nikita/lib/docker/load'
              });
              break;
            }
          }
        }
      }
      return callback(err, {
        status: status,
        stdout: stdout,
        stderr: stderr
      });
    });
  });
};


// ## Exports
module.exports = {
  handler: handler,
  schema: schema
};

// ## Dependencies
docker = require('./utils');

string = require('@nikitajs/core/lib/misc/string');

util = require('util');
