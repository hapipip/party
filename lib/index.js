'use strict';

const Pellmell = require('pellmell');

const internals = {};

internals.loadModels = modelPath => {
  const models = Pellmell.patch(modelPath);
  
  console.log(models);
};

exports.register = (server, options, next) => {
  console.log(options);
  
  options.models.forEach(modelPath => {
    internals.loadModels(modelPath);
  })


  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};