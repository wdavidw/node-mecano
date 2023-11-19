
export default
  tags:
    tools_repo: true
  mariadb:
    distrib: 'almalinux8'
    basearch: '$arch'
  config: [
    label: 'local'
    sudo: true
  ,
    label: 'remote'
    sudo: true
    ssh:
      host: '127.0.0.1', username: process.env.USER
      private_key_path: '~/.ssh/id_ed25519'
  ]
