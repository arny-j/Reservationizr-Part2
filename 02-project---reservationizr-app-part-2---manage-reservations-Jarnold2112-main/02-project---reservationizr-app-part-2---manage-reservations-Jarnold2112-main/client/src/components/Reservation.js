import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";
import { setISODay } from "date-fns";
import { useAuth0 } from "@auth0/auth0-react";

const Reservation = () => {
	const { id } = useParams();
	const [reservation, setReservation] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isNotFound, setIsNotFound] = useState(false);
	const { getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		const fetchData = async () => {
			const accessToken = await getAccessTokenSilently();
			const fetchUrl = await fetch(`http://localhost:5001/reservations/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});
			// FIXME: Make a fetch request and call setRestaurant with the response body
			if (!fetchUrl.ok) {
				setIsNotFound(true);
				setIsLoading(false);
				return;
			}
			const data = await fetchUrl.json();
			setReservation(data);
			setIsLoading(false);
		};
		fetchData();
	}, [id]);
	if (isNotFound) {
		return (
			<>
				<p className="error">Sorry! We can't find that Reservation.</p>
			</>
		);
	}
	if (isLoading) {
		return <p>Loading...</p>;
	}
	return (
		<>
			<h1>Reservation</h1>
			<div className="reservation">
				<p className="nameReservation">{reservation.restaurantName}</p>
				<p className="dateReservation">{reservation.date}</p>
				<p className="partySizeReservation">
					Party Size: <span>{reservation.partySize}</span>
				</p>
			</div>
		</>
	);
};

export default Reservation;
