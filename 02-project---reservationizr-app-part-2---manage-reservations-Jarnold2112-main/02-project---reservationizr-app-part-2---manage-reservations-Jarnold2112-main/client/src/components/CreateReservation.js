import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";
import formateDate, { formatDate } from "../utils/formatDate";

const CreateReservation = ({ restaurantName }) => {
	const [partySize, setPartySize] = useState(1);
	const [date, setSelectedDate] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorStatus, setErrorStatus] = useState(false);
	const navigate = useNavigate();
	const { getAccessTokenSilently } = useAuth0();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const accessToken = await getAccessTokenSilently();

		setIsLoading(true);

		const reservation = {
			partySize,
			date: date.toISOString(),
			restaurantName,
		};

		const response = await fetch("http://localhost:5001/reservations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(reservation),
		});

		if (!response.ok) {
			setIsError(true);
			setErrorStatus(response.status);
		} else {
			setIsLoading(false);
			navigate("/reservations");
		}
	};
	return (
		<>
			<div className="reservation-form">
				<h2>Create Reservation at {restaurantName}</h2>
				<form>
					<div className="form-group">
						<label htmlFor="partySize">Party Size:</label>
						<input
							className="partySize"
							type="number"
							id="partySize"
							value={partySize}
							onChange={(e) => setPartySize(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="date">Date:</label>
						<DatePicker
							className="createDate"
							id="date"
							selected={date}
							onChange={(date) => setSelectedDate(date)}
							dateFormat="yyyy-MM-dd"
							required
						/>
					</div>
					<button type="submit" onClick={handleSubmit} className="submitButton">
						Create Reservation
					</button>
				</form>
			</div>
		</>
	);
};

export default CreateReservation;
