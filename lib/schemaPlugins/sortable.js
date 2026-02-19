module.exports = function sortable () {

	const list = this;

	this.add({
		sortOrder: { type: Number, index: true, hidden: true },
	});

	this.schema.pre('save', function (next) {

		if (typeof this.sortOrder === 'number') {
			return next();
		}

		const item = this;

		const addLast = (done) => {
			list.model.findOne().sort('-sortOrder').exec()
				.then((max) => {
					item.sortOrder = (max && max.sortOrder) ? max.sortOrder + 1 : 1;
					done();
				})
				.catch(() => {
					item.sortOrder = 1;
					done();
				});
		};

		if (list.get('sortable') === 'unshift') {
			list.model.updateMany(
				{ sortOrder: { $exists: true } },
				{ $inc: { sortOrder: 1 } }
			)
				.then(() => {
					item.sortOrder = 1;
					next();
				})
				.catch(() => {
					addLast(next);
				});
		} else {
			addLast(next);
		}
	});

	this.schema.statics.reorderItems = function reorderItems (id, prevOrder, newOrder, cb) {

		prevOrder = parseFloat(prevOrder);
		newOrder = parseFloat(newOrder);

		const whichWay = (newOrder > prevOrder) ? -1 : 1;
		const gte = (newOrder > prevOrder) ? prevOrder + 1 : newOrder;
		const lte = (newOrder > prevOrder) ? newOrder : prevOrder - 1;

		list.model.updateMany(
			{
				sortOrder: { $gte: gte, $lte: lte },
			},
			{ $inc: { sortOrder: whichWay } }
		)
			.then(() => list.model.findOneAndUpdate({ _id: id }, { sortOrder: newOrder }))
			.then((result) => {
				if (cb) cb(null, result);
			})
			.catch((err) => {
				if (cb) cb(err);
			});
	};

};
