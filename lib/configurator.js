'use strict';

const internals = {};

internals.parseStore = (stores) => {
  const adapters = {
    'memory': false,
    'disk': false,
    'mysql': false
  };
  const res = {};

  Object.keys(stores).forEach(key => {
    adapters[stores[key].adapter] = true;
  });

  Object.keys(adapters).forEach(key => {
    if (adapters[key]) {
      res[key] = require('sails-' + key);
    }
  });

  return res;
};

module.exports.configure = (server, options, callback) => {
  return server.register({
    register: require('dogwater'),
    options: {
      adapters: internals.parseStore(options.stores),
      connections: options.stores
    }
  }, callback);
};
