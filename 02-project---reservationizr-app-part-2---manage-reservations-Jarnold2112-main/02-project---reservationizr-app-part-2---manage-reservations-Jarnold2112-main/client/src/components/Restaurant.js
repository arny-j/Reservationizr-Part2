import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";

const Restaurant = () => {
	const { id } = useParams();
	const [restaurant, setRestaurant] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isNotFound, setIsNotFound] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const fetchUrl = await fetch(`http://localhost:5001/restaurants/${id}`);
			// FIXME: Make a fetch request and call setRestaurant with the response body
			if (fetchUrl.ok === false) {
				setIsNotFound(true);
				return;
			}
			const data = await fetchUrl.json();
			setRestaurant(data);
			setIsLoading(false);

			setIsLoading(false);
		};
		fetchData();
	}, [id]);
	if (isNotFound) {
		return (
			<>
				<p className="error">Sorry! We can't find that restaurant.</p>
			</>
		);
	}
	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<div className="restaurant">
				<h2 className="name">{restaurant.name}</h2>
				<img src={restaurant.image} alt={restaurant.name} className="image" />
				<p className="description">{restaurant.description}</p>
				<CreateReservation restaurantName={restaurant.name} />
			</div>
		</>
	);
};

export default Restaurant;
