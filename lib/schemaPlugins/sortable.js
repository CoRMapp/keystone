module.exports = function sortable () {

	var list = this;

	this.add({
		sortOrder: { type: Number, index: true, hidden: true },
	});

	this.schema.pre('save', function (next) {

		if (typeof this.sortOrder === 'number') {
			return next();
		}

		var item = this;

		var addLast = function (done) {
			list.model.findOne().sort('-sortOrder').exec() // eslint-disable-line no-unused-vars
				.then(function (max) {
					item.sortOrder = (max && max.sortOrder) ? max.sortOrder + 1 : 1;
					done();
				})
				.catch(function (err) { // eslint-disable-line handle-callback-err
					item.sortOrder = 1;
					done();
				});
		};

		if (list.get('sortable') === 'unshift') {
			list.model.updateMany(
				{ sortOrder: { $exists: true } },
				{ $inc: { sortOrder: 1 } }
			)
				.then(function () {
					item.sortOrder = 1;
					next();
				})
				.catch(function (err) {
					console.log('err', err);
					addLast(next);
				});
		} else {
			addLast(next);
		}
	});

	this.schema.statics.reorderItems = function reorderItems (id, prevOrder, newOrder, cb) {

		prevOrder = parseFloat(prevOrder);
		newOrder = parseFloat(newOrder);

		var whichWay = (newOrder > prevOrder) ? -1 : 1;
		var gte = (newOrder > prevOrder) ? prevOrder + 1 : newOrder;
		var lte = (newOrder > prevOrder) ? newOrder : prevOrder - 1;

		list.model.updateMany(
			{
				sortOrder: { $gte: gte, $lte: lte },
			},
			{ $inc: { sortOrder: whichWay } }
		)
			.then(function () {
				return list.model.findOneAndUpdate({ _id: id }, { sortOrder: newOrder });
			})
			.catch(function (err) {
				console.log('err', err);
				if (cb) cb(err);
			})
			.then(function (result) {
				if (cb) cb(null, result);
			});
	};

};
