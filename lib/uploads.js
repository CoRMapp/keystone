const fs = require('fs');
const multer = require('multer');
const os = require('os');

function handleUploadedFiles (req, res, next) {
	if (!req.files || !Array.isArray(req.files)) return next();
	const originalFiles = req.files;
	const files = {};
	originalFiles.forEach((i) => {
		if (i.fieldname in files) {
			const tmp = files[i.fieldname];
			files[i.fieldname] = [tmp];
		}
		if (Array.isArray(files[i.fieldname])) {
			files[i.fieldname].push(i);
		} else {
			files[i.fieldname] = i;
		}
	});
	req.files = files;
	const cleanup = () => {
		originalFiles.forEach((i) => {
			if (i.path) {
				fs.unlink(i.path, () => {});
			}
		});
	};
	res.on('close', cleanup);
	res.on('finish', cleanup);
	next();
}

exports.handleUploadedFiles = handleUploadedFiles;

exports.configure = (app, options) => {
	const upload = multer(options || {
		dest: os.tmpdir(),
	});
	app.use(upload.any());
	app.use(handleUploadedFiles);
};
