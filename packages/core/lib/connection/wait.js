// Generated by CoffeeScript 2.4.1
// # `nikita.connection.wait`

// Check if one or multiple hosts listen one or multiple ports periodically and
// continue once all the connections succeed. Status will be set to "false" if the
// user connections succeed right away, considering that no change had occured.
// Otherwise it will be set to "true".   

// ## Options

// * `host`, `hosts` (array|string)  
//   One or multiple hosts, used to build or enrich the 'servers' option.
// * `interval` (number)  
//   Time in millisecond between each connection attempt.
// * `quorum` (number|boolean)  
//   Number of minimal successful connection, 50%+1 if "true".    
// * `port`, `ports` (array|string)  
//   One or multiple ports, used to build or enrich the 'servers' option.
// * `randdir`   
//   Directory where to write temporary file used internally to triger a 
// * `server`, `servers` (array|object|string)  
//   One or multiple servers, string must be in the form of "{host}:{port}",
//   object must have the properties "host" and "port".
// * `timeout` (number)   
//   Maximum time in millisecond to wait until this function is considered to have failed.

// Status is set to "true" if the first connection attempt was a failure and the 
// connection finaly succeeded.

// ## TODO

// The `server` and `servers` options shall be renamed `address` and `addresses`.

// ## Examples

// Wait for two domains on the same port.

// ```js
// require('nikita')
// .wait_connect({
//   hosts: [ '1.domain.com', '2.domain.com' ],
//   port: 80
// }, function(err, {status}){
//   // Servers listening on port 80
// })
// ```

// Wait for one domain on two diffents ports.

// ```js
// require('nikita')
// .wait_connect({
//   host: 'my.domain.com',
//   ports: [80, 443]
// }, function(err, {status}){
//   // Server listening on ports 80 and 443
// })
// ```

// Wait for two domains on diffents ports.

// ```js
// require('nikita')
// .wait_connect({
//   servers: [
//     {host: '1.domain.com', port: 80},
//     {host: '2.domain.com', port: 443}
//   ]
// }, function(err, {status}){
//   // Servers listening
// })
// ```

// ## Source Code
var array;

module.exports = function({options}) {
  var extract_servers, host, i, j, k, len, len1, port, quorum_target, ref, ref1, ref2, server, servers;
  this.log({
    message: "Entering wait for connection",
    level: 'DEBUG',
    module: 'nikita/connection/wait'
  });
  extract_servers = function(options) {
    var host, hosts, i, j, k, l, len, len1, len2, len3, m, port, ports, ref, ref1, ref2, ref3, servers;
    if ((options.port || options.ports) && !options.host) {
      throw Error(`Invalid host: ${options.host}`);
    }
    if ((options.host || options.hosts) && !options.port) {
      throw Error(`Invalid port: ${options.port}`);
    }
    ref = ['host', 'hosts'];
    for (i = 0, len = ref.length; i < len; i++) {
      k = ref[i];
      if (options[k] == null) {
        options[k] = [];
      }
      if ((ref1 = typeof options[k]) !== 'string' && ref1 !== 'object') {
        throw Error(`Invalid option '${options[k]}'`);
      }
      if (!Array.isArray(options[k])) {
        options[k] = [options[k]];
      }
    }
    hosts = [...options.host, ...options.hosts];
    ref2 = ['port', 'ports'];
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      k = ref2[j];
      if (options[k] == null) {
        options[k] = [];
      }
      if ((ref3 = typeof options[k]) !== 'string' && ref3 !== 'number' && ref3 !== 'object') {
        throw Error(`Invalid option '${options[k]}'`);
      }
      if (!Array.isArray(options[k])) {
        options[k] = [options[k]];
      }
    }
    ports = [...options.port, ...options.ports];
    servers = [];
    for (l = 0, len2 = hosts.length; l < len2; l++) {
      host = hosts[l];
      for (m = 0, len3 = ports.length; m < len3; m++) {
        port = ports[m];
        servers.push({
          host: host,
          port: port
        });
      }
    }
    return servers;
  };
  servers = extract_servers(options);
  ref = ['server', 'servers'];
  for (i = 0, len = ref.length; i < len; i++) {
    k = ref[i];
    if (options[k] == null) {
      options[k] = [];
    }
    if ((ref1 = typeof options[k]) !== 'string' && ref1 !== 'object') {
      throw Error(`Invalid option '${options[k]}'`);
    }
    if (typeof options[k] === 'string') {
      [host, port] = options[k].split(':');
      options[k] = {
        host: host,
        port: port
      };
    }
    if (!Array.isArray(options[k])) {
      options[k] = [options[k]];
    }
    options[k] = array.flatten(options[k]);
    ref2 = options[k];
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      server = ref2[j];
      servers.push(...extract_servers(server));
    }
  }
  if (!servers.length) {
    this.log({
      message: "No connection to wait for",
      level: 'WARN',
      module: 'nikita/connection/wait'
    });
    return;
  }
  // Validate servers
  if (options.interval == null) {
    options.interval = 2000; // 2s
  }
  options.interval = Math.round(options.interval / 1000);
  quorum_target = options.quorum;
  if (quorum_target && quorum_target === true) {
    quorum_target = Math.ceil(servers.length / 2);
  } else if (quorum_target == null) {
    quorum_target = servers.length;
  }
  if (!(options.timeout > 0)) {
    // Note, the option is not tested and doesnt seem to work from a manual test
    options.timeout = 0;
  }
  options.timeout = Math.round(options.timeout / 1000);
  return this.system.execute({
    bash: true,
    cmd: `function compute_md5 {\n  echo $1 | openssl md5 | sed 's/^.* \\([a-z0-9]*\\)$/\\1/g'\n}\naddresses=( ${servers.map(function(server) {
      return `'${server.host}:${server.port}'`;
    }).join(' ')} )\ntimeout=${options.timeout || ''}\nmd5=\`compute_md5 \${addresses[@]}\`\nranddir="${options.randdir || ''}"\nif [ -z $randir ]; then\n  if [ -w /dev/shm ]; then\n    randdir="/dev/shm/$md5"\n  else\n    randdir="/tmp/$md5"\n  fi\nfi\nquorum_target=${quorum_target}\necho "[INFO] randdir is: $randdir"\nmkdir -p $randdir\necho 3 > $randdir/signal\necho 0 > $randdir/quorum\nfunction remove_randdir {\n  for address in "\${addresses[@]}" ; do\n    host="\${address%%:*}"\n    port="\${address##*:}"\n    rm -f $randdir/\`compute_md5 $host:$port\`\n  done\n}\nfunction check_quorum {\n  quorum_current=\`cat $randdir/quorum\`\n  if [ $quorum_current -ge $quorum_target ]; then\n    echo '[INFO] Quorum is reached'\n    remove_randdir\n  fi\n}\nfunction check_timeout {\n  local timeout=$1\n  local randfile=$2\n  sleep $timeout\n  echo "[WARN] Reach timeout"\n  rm -f $randfile\n}\nfunction wait_connection {\n  local host=$1\n  local port=$2\n  local randfile=$3\n  local count=0\n  echo "[DEBUG] Start wait for $host:$port"\n  isopen="echo > '/dev/tcp/$host/$port'"\n  touch "$randfile"\n  while [[ -f "$randfile" ]] && ! \`bash -c "$isopen" 2>/dev/null\`; do\n    ((count++))\n    echo "[DEBUG] Connection failed to $host:$port on attempt $count" >&2\n    sleep ${options.interval}\n  done\n  if [[ -f "$randfile" ]]; then\n    echo "[DEBUG] Connection ready to $host:$port"\n  fi\n  echo $(( $(cat $randdir/quorum) + 1 )) > $randdir/quorum\n  check_quorum\n  if [ "$count" -gt "0" ]; then\n    echo "[WARN] Status is now active, count is $count"\n    echo 0 > $randdir/signal\n  fi\n}\nif [ ! -z "$timeout" ]; then\n  host="\${address%%:*}"\n  port="\${address##*:}"\n  check_timeout $timeout \`compute_md5 $host:$port\` &\nfi\nfor address in "\${addresses[@]}" ; do\n  host="\${address%%:*}"\n  port="\${address##*:}"\n  randfile=$randdir/\`compute_md5 $host:$port\`\n  wait_connection $host $port $randfile &\ndone\nwait\n# Clean up\nsignal=\`cat $randdir/signal\`\nremove_randdir\necho "[INFO] Exit code is $signal"\nexit $signal`,
    code_skipped: 3,
    stdin_log: false
  });
};

// ## Dependencies
array = require('../misc/array');
