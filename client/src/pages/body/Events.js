import React, {useState} from "react";
import EventList from "../../components/EventList";
import CheckSet from "../../components/CheckSet";
import {Dropdown} from "react-bootstrap";

const Event = () => {
	const [filter, setFilter] = useState({
		current: true,
		free: false,
		available: false,
		food: false,
		unlimited: false,
		outside: false,
		sponsorised: false,
		sort: "begin_date",
		asc: false
	});

	const handleFormChange = event => {
		let tempFilter = {...filter};
		const target = event.target;
		const value =
			target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		tempFilter[name] = value;
		setFilter(tempFilter);
	};

	const handleButtonChange = () => {
		let tempFilter = {...filter};
		tempFilter["asc"] = !filter.asc;
		setFilter(tempFilter);
	};

	return (
		<div className={`${"flex"}`}>
			<div>
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						Filtrer
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<CheckSet
							set={[
								{
									label: "Current",
									name: "current",
									checked: filter.current
								},
								{
									label: "Free",
									name: "free",
									checked: filter.free
								},
								{
									label: "Available",
									name: "available",
									checked: filter.available
								},
								{
									label: "Miammiam glouglou",
									name: "food",
									checked: filter.food
								},
								{
									label: "Dehors",
									name: "outside",
									checked: filter.outside
								},
								{
									label: "Places illimitées",
									name: "unlimited",
									checked: filter.unlimited
								},
								{
									label: "Sponsorisé",
									name: "sponsorised",
									checked: filter.sponsorised
								}
							]}
							onChange={handleFormChange}
							type="checkbox"
						/>
					</Dropdown.Menu>
				</Dropdown>
				<p> Trier par : </p>
				<select
					value={filter.sort}
					name="sort"
					onChange={handleFormChange}
				>
					<option value="begin_date">Date</option>
					<option value="name">Nom</option>
					<option value="cost">Prix</option>
					<option value="place">Lieu</option>
				</select>
				<button onClick={handleButtonChange}>⇃↾</button>
				<EventList filter={filter} />
			</div>
			<div>
				Album
				<div>Arboresence des events avec liens</div>
			</div>
		</div>
	);
};

export default Event;
