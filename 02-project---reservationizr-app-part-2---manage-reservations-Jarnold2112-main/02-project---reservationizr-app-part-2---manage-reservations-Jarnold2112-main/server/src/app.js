const express = require("express");
const cors = require("cors");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const app = express();
const mongoose = require("mongoose");
const { auth } = require("express-oauth2-jwt-bearer");
const { celebrate, Joi, errors, Segments } = require("celebrate");

app.use(cors());
app.use(express.json());
const checkJwt = auth({
	audience: "https://reservationizr.com",
	issuerBaseURL: `https://dev-eb676hxk0bsgebtc.us.auth0.com/`,
});

// All restaurants
app.get("/restaurants", async (request, response) => {
	const restaurants = await RestaurantModel.find({});
	response.send(restaurants);
});

// Single Restaurant
app.get("/restaurants/:id", (request, response) => {
	const { id } = request.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		response.status(400).json({
			error: "invalid id provided",
		});
		return;
	}

	RestaurantModel.findById(id).then((restaurant) => {
		if (!restaurant) {
			response.status(404).json({
				error: "not found",
			});
		} else {
			response.status(200).send(restaurant);
		}
	});
});

// All Reservations
app.get("/reservations", checkJwt, async (request, response) => {
	const userId = request.auth.payload.sub;
	const reservation = await ReservationModel.find({ userId });
	response.send(reservation);
});

// Single Reservation
app.get("/reservations/:id", checkJwt, (request, response) => {
	const { id } = request.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		response.status(400).json({
			error: "invalid id provided",
		});
		return;
	}

	ReservationModel.findById(id).then((reservation) => {
		if (!reservation) {
			response.status(404).json({
				error: "not found",
			});
		} else {
			if (reservation.userId !== request.auth.payload.sub) {
				response.status(403).send({
					error: "user does not have permission to access this reservation",
				});
			} else {
				response.status(200).send(reservation);
			}
		}
	});
});

app.post(
	"/reservations",
	checkJwt,
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			partySize: Joi.number().required().min(1),
			date: Joi.date().iso().greater("now").required(),
			restaurantName: Joi.string().required(),
		}),
	}),
	async (request, response, next) => {
		try {
			const { body, auth } = request;
			const reservationBody = {
				userId: auth.payload.sub,
				...body,
			};

			const reservation = new ReservationModel(reservationBody);
			await reservation.save();
			return response.status(201).send(reservation);
		} catch (error) {
			if (error.name === "UnauthorizedError") {
				error.statusCode = 401;
				return next(error);
			}
			error.status = 400;
			next(error);
		}
	}
);

app.use(errors());
module.exports = app;
