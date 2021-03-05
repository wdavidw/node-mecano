// Generated by CoffeeScript 2.5.1
  // # `nikita.file.download`

// Download files using various protocols.

// In local mode (with an SSH connection), the `http` protocol is handled with the
  // "request" module when executed locally, the `ftp` protocol is handled with the
  // "jsftp" and the `file` protocol is handle with the native `fs` module.

// The behavior of download may be confusing wether you are running over SSH or
  // not. Its philosophy mostly rely on the target point of view. When download
  // run, the target is local, compared to the upload function where target
  // is remote.

// A checksum may provided with the option "sha256", "sha1" or "md5" to validate the uploaded
  // file signature.

// Caching is active if "cache_dir" or "cache_file" are defined to anything but false.
  // If cache_dir is not a string, default value is './'
  // If cache_file is not a string, default is source basename.

// Nikita resolve the path from "cache_dir" to "cache_file", so if cache_file is an
  // absolute path, "cache_dir" will be ignored

// If no cache is used, signature validation is only active if a checksum is
  // provided.

// If cache is used, signature validation is always active, and md5sum is automatically
  // calculated if neither sha256, sh1 nor md5 is provided.

// ## Output

// * `$status` (boolean)   
  //   Value is "true" if file was downloaded.

// ## File example

// ```js
  // const {$status} = await nikita.file.download({
  //   source: 'file://path/to/something',
  //   target: 'node-sigar.tgz'
  // })
  // console.info(`File downloaded: ${$status}`)
  // ```

// ## HTTP example

// ```js
  // const {$status} = await nikita.file.download({
  //   source: 'https://github.com/adaltas/node-nikita/tarball/v0.0.1',
  //   target: 'node-sigar.tgz'
  // })
  // console.info(`File downloaded: ${$status}`)
  // ```

// ## TODO

// It would be nice to support alternatives sources such as FTP(S) or SFTP.

// ## Hooks
var fs, handler, on_action, path, schema, url, utils,
  indexOf = [].indexOf;

on_action = async function({
    config,
    tools: {find}
  }) {
  config.cache = (await find(function({
      config: {cache}
    }) {
    return cache;
  }));
  config.cache_file = (await find(function({
      config: {cache_file}
    }) {
    return cache_file;
  }));
  config.cache_dir = (await find(function({
      config: {cache_dir}
    }) {
    return cache_dir;
  }));
  if (/^file:\/\//.test(config.source)) {
    return config.source = config.source.substr(7);
  }
};

// ## Schema
schema = {
  type: 'object',
  properties: {
    'cache': {
      type: 'boolean',
      description: `Activate the cache, default to true if either "cache_dir" or
"cache_file" is activated.`
    },
    'cache_dir': {
      type: 'string',
      description: `Path of the cache directory.`
    },
    'cache_file': {
      type: ['boolean', 'string'],
      description: `Cache the file on the executing machine, equivalent to cache unless an
ssh connection is provided. If a string is provided, it will be the
cache path. By default: basename of source`
    },
    'cookies': {
      type: 'array',
      items: {
        type: 'string'
      },
      description: `Extra cookies  to include in the request when sending HTTP to a
server.`
    },
    'force': {
      type: 'boolean',
      description: `Overwrite the target file if it exists.`
    },
    'force_cache': {
      type: 'boolean',
      description: `Force cache overwrite if it exists`
    },
    'gid': {
      $ref: 'module://@nikitajs/core/lib/actions/fs/chown#/properties/gid'
    },
    'http_headers': {
      type: 'array',
      items: {
        type: 'string'
      },
      description: `Extra header to include in the request when sending HTTP to a server.`
    },
    'location': {
      type: 'boolean',
      description: `If the server reports that the requested page has moved to a different
location (indicated with a Location: header and a 3XX response code),
this option will make curl redo the request on the new place.`
    },
    'md5': {
      default: false,
      type: ['boolean', 'string'],
      description: `Validate uploaded file with md5 checksum (only for binary upload for
now), may be the string checksum or will be deduced from source if
"true".`
    },
    'mode': {
      $ref: 'module://@nikitajs/core/lib/actions/fs/chmod#/properties/mode'
    },
    'proxy': {
      type: 'string',
      description: `Use the specified HTTP proxy. If the port number is not specified, it
is assumed at port 1080. See curl(1) man page.`
    },
    'sha1': {
      default: false,
      type: ['boolean', 'string'],
      description: `Validate uploaded file with sha1 checksum (only for binary upload for
now), may be the string checksum or will be deduced from source if
"true".`
    },
    'sha256': {
      default: false,
      type: ['boolean', 'string'],
      description: `Validate uploaded file with sha1 checksum (only for binary upload for
now), may be the string checksum or will be deduced from source if
"true".`
    },
    'source': {
      type: 'string',
      description: `File, HTTP URL, GIT repository. File is the default protocol if source
is provided without any.`
    },
    'target': {
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'function'
        }
      ],
      description: `File path where to write content to. Pass the content.`
    },
    'uid': {
      $ref: 'module://@nikitajs/core/lib/actions/fs/chown#/properties/uid'
    }
  },
  required: ['target', 'source']
};

// ## Handler
handler = async function({
    config,
    ssh,
    tools: {log, path}
  }) {
  var algo, cookie, err, exists, hash, hash_source, hash_target, header, match, protocols_ftp, protocols_http, ref, ref1, ref2, ref3, ref4, ref5, shortcircuit, source_hash, source_url, stageDestination, stats;
  if (config.md5 != null) {
    if ((ref = typeof config.md5) !== 'string' && ref !== 'boolean') {
      throw Error(`Invalid MD5 Hash:${config.md5}`);
    }
    algo = 'md5';
    source_hash = config.md5;
  } else if (config.sha1 != null) {
    if ((ref1 = typeof config.sha1) !== 'string' && ref1 !== 'boolean') {
      throw Error(`Invalid SHA-1 Hash:${config.sha1}`);
    }
    algo = 'sha1';
    source_hash = config.sha1;
  } else if (config.sha256 != null) {
    if ((ref2 = typeof config.sha256) !== 'string' && ref2 !== 'boolean') {
      throw Error(`Invalid SHA-256 Hash:${config.sha256}`);
    }
    algo = 'sha256';
    source_hash = config.sha256;
  } else {
    algo = 'md5';
  }
  protocols_http = ['http:', 'https:'];
  protocols_ftp = ['ftp:', 'ftps:'];
  if (config.force) {
    log({
      message: `Using force: ${JSON.stringify(config.force)}`,
      level: 'DEBUG'
    });
  }
  source_url = url.parse(config.source);
  match = null;
  if ((config.cache == null) && source_url.protocol === null) {
    // Disable caching if source is a local file and cache isnt explicitly set by user
    config.cache = false;
  }
  if (config.cache == null) {
    config.cache = !!(config.cache_dir || config.cache_file);
  }
  if (config.http_headers == null) {
    config.http_headers = [];
  }
  if (config.cookies == null) {
    config.cookies = [];
  }
  // Normalization
  config.target = config.cwd ? path.resolve(config.cwd, config.target) : path.normalize(config.target);
  if (ssh && !path.isAbsolute(config.target)) {
    throw Error(`Non Absolute Path: target is ${JSON.stringify(config.target)}, SSH requires absolute paths, you must provide an absolute path in the target or the cwd option`);
  }
  // Shortcircuit accelerator:
  // If we know the source signature and if the target file exists
  // we compare it with the target file signature and stop if they match
  if (typeof source_hash === 'string') {
    ({shortcircuit} = (await this.call({
      $shy: true
    }, async function() {
      var err, hash;
      log({
        message: "Shortcircuit check if provided hash match target",
        level: 'WARN'
      });
      try {
        ({hash} = (await this.fs.hash(config.target, {
          algo: algo
        })));
        return {
          shortcircuit: !source_hash === hash
        };
      } catch (error) {
        err = error;
        if (err.code !== 'NIKITA_FS_STAT_TARGET_ENOENT') {
          throw err;
        }
        return {
          shortcircuit: false
        };
      }
    })));
    if (shortcircuit) {
      return true;
    }
    log({
      message: "Destination with valid signature, download aborted",
      level: 'INFO'
    });
  }
  // Download the file and place it inside local cache
  // Overwrite the config.source and source_url properties to make them
  // look like a local file instead of an HTTP URL
  if (config.cache) {
    await this.file.cache({
      // Local file must be readable by the current process
      $ssh: false,
      $sudo: false,
      source: config.source,
      cache_dir: config.cache_dir,
      cache_file: config.cache_file,
      http_headers: config.http_headers,
      cookies: config.cookies,
      md5: config.md5,
      proxy: config.proxy,
      location: config.location
    });
    source_url = url.parse(config.source);
  }
  try {
    // TODO
    // The current implementation seems inefficient. By modifying stageDestination,
    // we download the file, check the hash, and again treat it the HTTP URL
    // as a local file and check hash again.
    ({stats} = (await this.fs.base.stat({
      target: config.target
    })));
    if (utils.stats.isDirectory(stats != null ? stats.mode : void 0)) {
      log({
        message: "Destination is a directory",
        level: 'DEBUG'
      });
      config.target = path.join(config.target, path.basename(config.source));
    }
  } catch (error) {
    err = error;
    if (err.code !== 'NIKITA_FS_STAT_TARGET_ENOENT') {
      throw err;
    }
  }
  stageDestination = `${config.target}.${Date.now()}${Math.round(Math.random() * 1000)}`;
  if (ref3 = source_url.protocol, indexOf.call(protocols_http, ref3) >= 0) {
    log({
      message: "HTTP Download",
      level: 'DEBUG'
    });
    log({
      message: "Download file from url using curl",
      level: 'INFO'
    });
    // Ensure target directory exists
    await this.fs.mkdir({
      $shy: true,
      target: path.dirname(stageDestination)
    });
    // Download the file
    await this.execute({
      $shy: true,
      command: [
        'curl',
        config.fail ? '--fail' : void 0,
        source_url.protocol === 'https:' ? '--insecure' : void 0,
        config.location ? '--location' : void 0,
        ...((function() {
          var i,
        len,
        ref4,
        results;
          ref4 = config.http_headers;
          results = [];
          for (i = 0, len = ref4.length; i < len; i++) {
            header = ref4[i];
            results.push(`--header '${header.replace('\'',
        '\\\'')}'`);
          }
          return results;
        })()),
        ...((function() {
          var i,
        len,
        ref4,
        results;
          ref4 = config.cookies;
          results = [];
          for (i = 0, len = ref4.length; i < len; i++) {
            cookie = ref4[i];
            results.push(`--cookie '${cookie.replace('\'',
        '\\\'')}'`);
          }
          return results;
        })()),
        `-s ${config.source}`,
        `-o ${stageDestination}`,
        config.proxy ? `-x ${config.proxy}` : void 0
      ].join(' ')
    });
    hash_source = hash_target = null;
    ({hash} = (await this.fs.hash(stageDestination, {
      algo: algo
    })));
    if (typeof source_hash === 'string' && source_hash !== hash) {
      // Hash validation
      // Probably not the best to check hash, it only applies to HTTP for now
      throw Error(`Invalid downloaded checksum, found '${hash}' instead of '${source_hash}'`);
    }
    hash_source = hash;
    ({exists} = (await this.fs.base.exists({
      target: config.target
    })));
    if (exists) {
      ({hash} = (await this.fs.hash({
        target: config.target,
        algo: algo
      })));
      hash_target = hash;
    }
    match = hash_source === hash_target;
    log(match ? {
      message: `Hash matches as '${hash_source}'`,
      level: 'INFO',
      module: 'nikita/lib/file/download'
    } : {
      message: `Hash dont match, source is '${hash_source}' and target is '${hash_target}'`,
      level: 'WARN',
      module: 'nikita/lib/file/download'
    });
    if (match) {
      await this.fs.remove({
        $shy: true,
        target: stageDestination
      });
    }
  } else if ((ref4 = source_url.protocol, indexOf.call(protocols_http, ref4) < 0) && !ssh) {
    log({
      message: "File Download without ssh (with or without cache)",
      level: 'DEBUG'
    });
    hash_source = hash_target = null;
    ({hash} = (await this.fs.hash({
      target: config.source,
      algo: algo
    })));
    hash_source = hash;
    ({exists} = (await this.fs.base.exists({
      target: config.target
    })));
    if (exists) {
      ({hash} = (await this.fs.hash({
        target: config.target,
        algo: algo
      })));
      hash_target = hash;
    }
    match = hash_source === hash_target;
    log(match ? {
      message: `Hash matches as '${hash_source}'`,
      level: 'INFO',
      module: 'nikita/lib/file/download'
    } : {
      message: `Hash dont match, source is '${hash_source}' and target is '${hash_target}'`,
      level: 'WARN',
      module: 'nikita/lib/file/download'
    });
    if (!match) {
      await this.fs.mkdir({
        $shy: true,
        target: path.dirname(stageDestination)
      });
      await this.fs.copy({
        source: config.source,
        target: stageDestination
      });
    }
  } else if ((ref5 = source_url.protocol, indexOf.call(protocols_http, ref5) < 0) && ssh) {
    log({
      message: "File Download with ssh (with or without cache)",
      level: 'DEBUG'
    });
    hash_source = hash_target = null;
    ({hash} = (await this.fs.hash({
      $ssh: false,
      $sudo: false,
      target: config.source,
      algo: algo
    })));
    hash_source = hash;
    ({exists} = (await this.fs.base.exists({
      target: config.target
    })));
    if (exists) {
      ({hash} = (await this.fs.hash({
        target: config.target,
        algo: algo
      })));
      hash_target = hash;
    }
    match = hash_source === hash_target;
    log(match ? {
      message: `Hash matches as '${hash_source}'`,
      level: 'INFO',
      module: 'nikita/lib/file/download'
    } : {
      message: `Hash dont match, source is '${hash_source}' and target is '${hash_target}'`,
      level: 'WARN',
      module: 'nikita/lib/file/download'
    });
    if (!match) {
      await this.fs.mkdir({
        $shy: true,
        target: path.dirname(stageDestination)
      });
      try {
        await this.fs.base.createWriteStream({
          target: stageDestination,
          stream: function(ws) {
            var rs;
            rs = fs.createReadStream(config.source);
            return rs.pipe(ws);
          }
        });
        log({
          message: `Downloaded local source ${JSON.stringify(config.source)} to remote target ${JSON.stringify(stageDestination)}`,
          level: 'INFO'
        });
      } catch (error) {
        err = error;
        log({
          message: `Downloaded local source ${JSON.stringify(config.source)} to remote target ${JSON.stringify(stageDestination)} failed`,
          level: 'ERROR'
        });
      }
    }
  }
  log({
    message: "Unstage downloaded file",
    level: 'DEBUG'
  });
  if (!match) {
    await this.fs.move({
      source: stageDestination,
      target: config.target
    });
  }
  if (config.mode) {
    await this.fs.chmod({
      target: config.target,
      mode: config.mode
    });
  }
  if (config.uid || config.gid) {
    await this.fs.chown({
      target: config.target,
      uid: config.uid,
      gid: config.gid
    });
  }
  return {};
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    schema: schema
  }
};

// ## Module Dependencies
fs = require('fs');

path = require('path').posix; // need to detect ssh connection

url = require('url');

utils = require('./utils');
