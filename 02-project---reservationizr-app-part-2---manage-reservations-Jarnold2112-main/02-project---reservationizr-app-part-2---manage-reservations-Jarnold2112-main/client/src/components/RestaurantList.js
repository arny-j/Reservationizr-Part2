import "./RestaurantList.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RestaurantList = () => {
	const [restaurants, setRestaurants] = useState([]);

	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				const response = await fetch("http://localhost:5001/restaurants");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setRestaurants(data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchRestaurants();
	}, []);
	return (
		<>
			<div className="restaurants">
				<h1>Restaurants</h1>

				{restaurants.map((restaurant) => {
					return (
						<div className="restaurant" key={restaurant.id}>
							<img
								src={restaurant.image}
								alt={restaurant.name}
								className="image"
							/>
							<h2 className="name">{restaurant.name}</h2>
							<p className="description">{restaurant.description}</p>
							<Link
								to={`/restaurants/${restaurant.id}`}
								className="veiwRestaurant">
								Reserve Now
							</Link>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default RestaurantList;
