const fs = require('fs');
const debug = require('debug')('keystone:core:importer');
const path = require('path');

/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules in it (recursively).
 *
 * ####Example:
 *
 *     var importRoutes = keystone.importer(__dirname);
 *
 *     var routes = {
 *         site: importRoutes('./site'),
 *         api: importRoutes('./api')
 *     };
 *
 * @param {String} rel__dirname
 * @api public
 */

const dispatchImporter = (rel__dirname) => {

	const importer = (from) => {
		debug('importing ', from);
		const imported = {};
		const joinPath = (...args) => {
			return '.' + path.sep + path.join.apply(path, args);
		};

		const fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
		fs.readdirSync(fsPath).forEach((name) => {
			const info = fs.statSync(path.join(fsPath, name));
			debug('recur');
			if (info.isDirectory()) {
				imported[name] = importer(joinPath(from, name));
			} else {
				// only import files that we can `require`
				const ext = path.extname(name);
				const base = path.basename(name, ext);
				if (require.extensions[ext]) {
					imported[base] = require(path.join(rel__dirname, from, name));
				} else {
					debug('cannot require ', ext);
				}
			}
		});

		return imported;
	};

	return importer;
};

module.exports = dispatchImporter;
