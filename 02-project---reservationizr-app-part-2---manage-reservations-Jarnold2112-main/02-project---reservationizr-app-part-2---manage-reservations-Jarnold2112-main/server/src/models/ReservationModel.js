// FIXME: Add a Mongoose model here
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationModel = new Schema(
	{
		partySize: { type: Number, required: true },
		date: { type: Date, required: true },
		userId: { type: String, required: true },
		restaurantName: { type: String, required: true },
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

module.exports = mongoose.model("Reservation", ReservationModel);
