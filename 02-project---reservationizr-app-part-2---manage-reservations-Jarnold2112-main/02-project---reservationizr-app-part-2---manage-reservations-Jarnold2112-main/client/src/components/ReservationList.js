import React, { useState, useEffect } from "react";
import "./ReservationList.css";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useAuth0 } from "@auth0/auth0-react";

const ReservationList = () => {
	const [reservations, setReservatons] = useState([]);
	const { getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		const fetchReservations = async () => {
			const accessToken = await getAccessTokenSilently();
			try {
				const response = await fetch("http://localhost:5001/reservations", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				});
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setReservatons(data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchReservations();
	}, []);

	return (
		<>
			<h1>Upcoming reservations</h1>
			<div className="resrvationsContainer">
				<ul className="reservations">
					{reservations.map((reservation) => (
						<li key={reservation.id} className="reservation">
							<p className="name">{reservation.restaurantName}</p>
							<p className="date">{reservation.date}</p>
							<Link
								to={`/reservations/${reservation.id}`}
								className="view-more">
								<p>View More</p>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default ReservationList;
