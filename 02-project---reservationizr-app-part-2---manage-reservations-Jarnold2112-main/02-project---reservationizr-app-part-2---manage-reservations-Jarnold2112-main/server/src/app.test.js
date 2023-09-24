const request = require("supertest");
const app = require("./app");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");

// All Restaurants
test("GET /restaurnats", async () => {
	const restaurnats = [
		{
			id: "616005cae3c8e880c13dc0b9",
			name: "Curry Place",
			description:
				"Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
			image: "https://i.ibb.co/yftcRcF/indian.jpg",
		},
		{
			id: "616005e26d59890f8f1e619b",
			name: "Thai Isaan",
			description:
				"We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
			image: "https://i.ibb.co/HPjd2jR/thai.jpg",
		},
		{
			id: "616bd284bae351bc447ace5b",
			name: "Italian Feast",
			description:
				"From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
			image: "https://i.ibb.co/0r7ywJg/italian.jpg",
		},
	];

	const response = await request(app).get("/restaurants");
	expect(response.status).toBe(200);
	expect(response.body).toEqual(restaurnats);
});

// Single Restaurant
describe("GET /restaurants/:id", () => {
	const invalidRestaurantId = "invalid-id";
	it("GET /restaurants/:id", async () => {
		const restaurant = {
			id: "616005cae3c8e880c13dc0b9",
			name: "Curry Place",
			description:
				"Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
			image: "https://i.ibb.co/yftcRcF/indian.jpg",
		};

		const response = await request(app).get(
			"/restaurants/616005cae3c8e880c13dc0b9"
		);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(restaurant);
	});
	it("should return status 400 when an invalid restaurant ID is provided", async () => {
		const response = await request(app).get(
			`/restaurants/${invalidRestaurantId}`
		);
		expect(response.status).toBe(400);
	});
	it("should return status 404 when a valid but non-existent restaurant ID is provided", async () => {
		const nonExistentId = "609babb31d5f693e09d8b292";
		const response = await request(app).get(`/restaurants/${nonExistentId}`);
		expect(response.status).toBe(404);
	});
});

// All Reservations
describe("GET /reservations", () => {
	test("GET /reservations", async () => {
		const reservations = [
			{
				id: "507f1f77bcf86cd799439011",
				partySize: 4,
				date: "2023-11-17T06:30:00.000Z",
				userId: "mock-user-id",
				restaurantName: "Island Grill",
			},
			{
				id: "614abf0a93e8e80ace792ac6",
				partySize: 2,
				date: "2023-12-03T07:00:00.000Z",
				userId: "mock-user-id",
				restaurantName: "Green Curry",
			},
		];

		const response = await request(app).get("/reservations");
		expect(response.status).toBe(200);
		expect(response.body).toEqual(reservations);
	});
});

// Single Reservation
describe("GET /reservations/:id", () => {
	const invalidReservationId = "invalid-id";
	test("GET /reservations/:id", async () => {
		const reservation = {
			id: "507f1f77bcf86cd799439011",
			partySize: 4,
			date: "2023-11-17T06:30:00.000Z",
			userId: "mock-user-id",
			restaurantName: "Island Grill",
		};

		const response = await request(app).get(
			"/reservations/507f1f77bcf86cd799439011"
		);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(reservation);
	});
	it("should return status 400 when an invalid reservation ID is provided", async () => {
		const response = await request(app).get(
			`/reservations/${invalidReservationId}`
		);
		expect(response.status).toBe(400);
	});

	it("should return status 403 when user doesn't have permission to access a reservation", async () => {
		const reservation = {
			id: "61679189b54f48aa6599a7fd",
			partySize: 2,
			date: "2023-12-03T07:00:00.000Z",
			userId: "another-user-id",
			restaurantName: "Green Curry",
		};

		const response = await request(app).get(`/reservations/${reservation.id}`);

		expect(response.status).toBe(403);
		expect(response.body.error).toBe(
			"user does not have permission to access this reservation"
		);
	});
	it("should return status 404 when a valid but non-existent reservation ID is provided", async () => {
		const nonExistentId = "609babb31d5f693e09d8b292";
		const response = await request(app).get(`/reservations/${nonExistentId}`);
		expect(response.status).toBe(404);
	});
});

// Create a Rerervation
describe("POST /reservations", () => {
	const invalidReservationId = "invalid-id";
	test("POST /reservations creates a new reservation", async () => {
		const body = {
			partySize: 4,
			date: "2023-11-17T06:30:00.000Z",
			restaurantName: "Island Grill",
		};
		const response = await request(app).post("/reservations").send(body);

		expect(response.status).toEqual(201);
		expect(response.body).toEqual(expect.objectContaining(body));
	});

	it("should return status 400 when an invalid reservation ID is provided", async () => {
		const response = await request(app).get(
			`/reservations/${invalidReservationId}`
		);
		expect(response.status).toBe(400);
	});
});
