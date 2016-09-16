'use strict';

const Pellmell = require('pellmell');
const Hoek = require('hoek');

const internals = {};

internals.camelToUnderscore = (str) => {
  str = str.replace(/([A-Z])/g, (letter) => {
    return '_' + letter.toLowerCase();
  });
  if (str.charAt(0) === '_') {
    str = str.slice(1);
  }
  return str;
};

internals.parseAttribute = attributes => {
  Object.keys(attributes).forEach(key => {
    if (typeof attributes[key] !== 'object') {
      const value = attributes[key];
      attributes[key] = {
        type: value
      };
    }
    if (attributes[key].default !== undefined) {
      attributes[key].defaultTo = attributes[key].default;
      delete attributes[key].default;
    }
    if (key !== key.toLowerCase() && !attributes[key].columnName) {
      attributes[key].columnName = internals.camelToUnderscore(key);
    }
  });
};

internals.parseModels = (models, defaultStore) => {
  const res = [];
  Object.keys(models).forEach(key => {
    if (!models[key]) return;
    if (models[key].abstract === null) return;

    let def = models[key];
    if (def.inherit) {
      def = Hoek.applyToDefaults(models[def.inherit], def);
      delete def.inherit;
      delete def.abstract;
    }

    def.identity = key;
    def.connection = def.connection || defaultStore;

    if (!def.tableName && key !== key.toLowerCase()) {
      def.tableName = internals.camelToUnderscore(key);
    }

    internals.parseAttribute(def.attributes);

    res.push(def);
  });

  return res;
};

internals.loadModels = (modelPath) => {
  const models = Pellmell.patch(modelPath);
  const res = {};

  Object.keys(models).forEach(key => {
    Hoek.merge(res, models[key], false);
  });

  return res;
};

module.exports.getModels = options => {
  let res = [];
  options.models.forEach(modelPath => {
    const models = internals.loadModels(modelPath);
    Hoek.merge(
      res,
      internals.parseModels(models, options.defaultStore)
    );
  });
  return res;
};
