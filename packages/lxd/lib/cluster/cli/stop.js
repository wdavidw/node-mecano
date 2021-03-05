// Generated by CoffeeScript 2.5.1
var nikita;

nikita = require('@nikitajs/core/lib');

require('@nikitajs/lxd/lib/register');

module.exports = function({params}) {
  return nikita({
    $debug: params.debug
  }).log.cli({
    pad: {
      host: 20,
      header: 60
    }
  }).log.md({
    basename: 'start',
    basedir: params.log,
    archive: false,
    $if: params.log
  }).execute({
    cwd: `${__dirname}/../../../assets`,
    command: `vagrant halt`
  });
};
