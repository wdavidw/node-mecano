
path = require 'path'
nikita = require '@nikitajs/core/lib'
require '@nikitajs/lxd/lib/register'
require '@nikitajs/tools/lib/register'

nikita
.log.cli pad: host: 20, header: 60
.log.md filename: '/tmp/nikita_tools_npm_lxd_install'
.lxd.cluster
  $header: 'Container'
  containers:
    'nikita-tools-npm':
      image: 'images:centos/7'
      properties:
        'environment.NIKITA_TEST_MODULE': "/nikita/packages/tools/env/npm/test.coffee"
        # files in "/nikita" with vagrant user 1000 on host are mapped to root
        'raw.idmap': if process.env['NIKITA_LXD_IN_VAGRANT']
        then 'both 1000 0'
        else "both #{process.getuid()} 0"
      disk:
        nikitadir:
          path: '/nikita'
          source: if process.env['NIKITA_LXD_IN_VAGRANT']
          then '/nikita'
          else path.join(__dirname, '../../../../')
      ssh: enabled: true
  provision_container: ({config}) ->
    await @lxd.exec
      $header: 'Node.js'
      container: config.container
      command: """
      command -v node && exit 42
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
      . ~/.bashrc
      nvm install node
      """
      trap: true
      code_skipped: 42
    await @lxd.exec
      $header: 'SSH keys'
      container: config.container
      command: """
      mkdir -p /root/.ssh && chmod 700 /root/.ssh
      if [ ! -f /root/.ssh/id_rsa ]; then
        ssh-keygen -t rsa -f /root/.ssh/id_rsa -N ''
        cat /root/.ssh/id_rsa.pub > /root/.ssh/authorized_keys
      fi
      """
      trap: true
