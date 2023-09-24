// FIXME: Add a Mongoose model here
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantModel = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		image: String,
	},
	{
		toJSON: {
			transform: (doc, ret) => {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

module.exports = mongoose.model("Restaurant", RestaurantModel);
