
module.exports =
  tags:
    posix: true
    tools_cron: false # disable_cron
    tools_dconf: false
    tools_repo: false
    tools_rubygems: false
    tools_apm: false
    tools_npm: false
    tools_iptables: false
  ssh: [
    null
  ,
    ssh: host: '127.0.0.1', username: process.env.USER
    # no password, will use private key
    # if found in "~/.ssh/id_rsa"
    # Exemple with vagrant:
    # ssh:
    #   host: '127.0.0.1', port: 2222, username: 'vagrant'
    #   private_key_path: "#{require('os').homedir()}/.vagrant.d/insecure_private_key"
  ]
