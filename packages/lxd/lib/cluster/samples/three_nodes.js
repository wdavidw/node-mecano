// Dependencies
const path = require('path');
const nikita = require('@nikitajs/core/lib');
require('@nikitajs/log/lib/register');
require('@nikitajs/lxd/lib/register');
require('@nikitajs/tools/lib/register');

/*
Notes:

SSH private and public keys are generated in an "assets" directory inside
the current working directory.
*/
nikita.log.cli({
  pad: {
    host: 20,
    header: 60
  }
}).lxc.cluster({
  $header: 'Container',
  networks: {
    lxdbr3pub: {
      'ipv4.address': '10.10.40.1/24',
      'ipv4.nat': true,
      'ipv6.address': 'none',
      'dns.domain': 'nikita.local'
    },
    lxdbr3priv: {
      'ipv4.address': '10.10.50.1/24',
      'ipv4.nat': false,
      'ipv6.address': 'none'
    }
  },
  containers: {
    n1: {
      image: 'images:centos/7',
      disk: {
        nikitadir: {
          path: '/nikita',
          source: process.env['NIKITA_HOME'] || path.join(__dirname, '../../../../')
        }
      },
      nic: {
        eth0: {
          name: 'eth0',
          nictype: 'bridged',
          parent: 'lxdbr3pub'
        },
        eth1: {
          name: 'eth1',
          nictype: 'bridged',
          parent: 'lxdbr3priv',
          'ipv4.address': '10.10.50.11'
        }
      },
      proxy: {
        ssh: {
          listen: 'tcp:0.0.0.0:2201',
          connect: 'tcp:0.0.0.0:22'
        }
      },
      ssh: {
        enabled: true
      },
      user: {
        nikita: {
          sudo: true,
          authorized_keys: './assets/id_ed25519.pub'
        }
      }
    },
    n2: {
      image: 'images:centos/7',
      disk: {
        nikitadir: {
          path: '/nikita',
          source: process.env['NIKITA_HOME'] || path.join(__dirname, '../../../../')
        }
      },
      nic: {
        eth0: {
          name: 'eth0',
          nictype: 'bridged',
          parent: 'lxdbr3pub'
        },
        eth1: {
          name: 'eth1',
          nictype: 'bridged',
          parent: 'lxdbr3priv',
          'ipv4.address': '10.10.50.12'
        }
      },
      proxy: {
        ssh: {
          listen: 'tcp:0.0.0.0:2202',
          connect: 'tcp:127.0.0.1:22'
        }
      },
      ssh: {
        enabled: true
      },
      user: {
        nikita: {
          sudo: true,
          authorized_keys: './assets/id_ed25519.pub'
        }
      }
    },
    n3: {
      image: 'images:centos/7',
      disk: {
        nikitadir: {
          path: '/nikita',
          source: process.env['NIKITA_HOME'] || path.join(__dirname, '../../../../')
        }
      },
      nic: {
        eth0: {
          name: 'eth0',
          nictype: 'bridged',
          parent: 'lxdbr3pub'
        },
        eth1: {
          name: 'eth1',
          nictype: 'bridged',
          parent: 'lxdbr3priv',
          'ipv4.address': '10.10.50.13'
        }
      },
      proxy: {
        ssh: {
          listen: 'tcp:0.0.0.0:2203',
          connect: 'tcp:127.0.0.1:22'
        }
      },
      ssh: {
        enabled: true
      },
      user: {
        nikita: {
          sudo: true,
          authorized_keys: './assets/id_ed25519.pub'
        }
      }
    }
  },
  prevision: async function({config}) {
    return (await this.tools.ssh.keygen({
      $header: 'SSH key',
      target: './assets/id_ed25519',
      bits: 2048,
      key_format: 'PEM',
      comment: 'nikita'
    }));
  },
  provision_container: async function({config}) {
    return (await this.lxc.exec({
      $header: 'Node.js',
      container: config.container,
      command: dedent`
        command -v node && exit 42
        curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
        bash n lts
      `,
      trap: true,
      code: [0, 42]
    }));
  }
// await @lxd.exec
//   $header: 'FQND'
//   container: config.container
//   command: """
//   fqdn=`hostnamectl status | grep 'Static hostname' | sed 's/^.* \\(.*\\)$/\\1/'`
//   [[ $fqdn == "#{config.fqdn}" ]] && exit 3
//   hostnamectl set-hostname #{config.fqdn} --static
//   """
// @lxc.file.push
//   debug: true
//   header: 'Test configuration'
//   container: options.container
//   gid: 'nikita'
//   uid: 'nikita'
//   source: './test.coffee'
//   target: '/nikita/packages/core/test.coffee'
}).then(() =>
  console.log('OK')
, (err) =>
  console.log('KO', err)
);
