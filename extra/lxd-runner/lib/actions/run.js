// Generated by CoffeeScript 2.7.0
module.exports = async function({config}) {
  await this.call('@nikitajs/lxd-runner/lib/actions/start', config);
  await this.call('@nikitajs/lxd-runner/lib/actions/test', config);
  return (await this.call('@nikitajs/lxd-runner/lib/actions/stop', config));
};
