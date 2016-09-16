'use strict';

const Parser = require('./parser');
const Configurator = require('./configurator');
const Fs = require('fs');
const Path = require('path');

const internals = {};

internals.createCacheFile = (filename, models) => {
  Fs.writeFileSync(filename, JSON.stringify(models, null, '  '));
};

internals.loadModels = options => {
  if (options.cache) {
    const filename = Path.join(options.cache, 'models.json');
    Fs.stat(filename, (err, stats) => {
      if (!err && stats.isFile()) {
        return require(filename);
      } else {
        const models = Parser.getModels(options);
        internals.createCacheFile(filename, models);
        return models;
      }
    });
  }

  return Parser.getModels(options);
};

exports.register = (server, options, next) => {
  const models = internals.loadModels(options);

  Configurator.configure(server, options, (err) => {
    if (err) throw err;
    server.dogwater(models);
    next();
  });
};

exports.register.attributes = {
  pkg: require('../package.json')
};
