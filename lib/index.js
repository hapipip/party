'use strict';

const Pellmell = require('pellmell');
const Hoek = require('hoek');

const internals = {};

internals.loadModels = modelPath => {
  const models = Pellmell.patch(modelPath);
  const res = {};

  Object.keys(models).forEach(key => {
    Hoek.merge(res, models[key], false);
  });

  console.log(res);
};

exports.register = (server, options, next) => {

  options.models.forEach(modelPath => {
    internals.loadModels(modelPath);
  });

  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
