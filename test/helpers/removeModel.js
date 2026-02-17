const mongoose = require('mongoose');

module.exports = function removeModel (modelName) {
  if (mongoose.models && mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }
  if (mongoose.modelSchemas && mongoose.modelSchemas[modelName]) {
    delete mongoose.modelSchemas[modelName];
  }
  // Mongoose 7+ uses connection.models
  if (mongoose.connection && mongoose.connection.models && mongoose.connection.models[modelName]) {
    delete mongoose.connection.models[modelName];
  }
};
