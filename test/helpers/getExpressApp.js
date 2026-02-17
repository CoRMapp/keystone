const keystone = require('../../index.js');
const mongoose = require('./getMongooseConnection.js');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const getExpressApp = () => {
	keystone.init({
		'mongoose': mongoose,
	});
	const app = keystone.express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	app.use(methodOverride());

	return app;
};

module.exports = getExpressApp;
