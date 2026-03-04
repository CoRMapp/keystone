const browserify = require('browserify');

const packages = require('./admin/client/packages');
const b = browserify({
	debug: process.env.NODE_ENV !== 'production',
});
packages.forEach((i) => { b.require(i); });
b.bundle().pipe(process.stdout);
