const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost:27017/test';

async function dropTestDatabase () {
  await mongoose.connect(mongoUri);
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
}

dropTestDatabase().catch(function (err) {
  console.error('Failed to drop test database:', err);
});
