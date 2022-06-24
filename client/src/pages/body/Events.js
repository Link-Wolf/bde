import React, {useState} from "react";
import EventList from "../../components/EventList";
import CheckSet from "../../components/CheckSet";
import {Dropdown} from "react-bootstrap";

const Event = () => {
	const [filter, setFilter] = useState({});

	return (
		<div className={`${"flex"}`}>
			<div>
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						Filtre
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<CheckSet
							set={[
								{name: "Current", value: "current"},
								{name: "Free", value: "free"},
								{name: "Available", value: "available"},
								{name: "Miammiam glouglou", value: "food"},
								{name: "Dehors", value: "outside"},
								{name: "Sponsorisé", value: "sponsorised"}
							]}
							onChange={null}
							type="checkbox"
						/>
					</Dropdown.Menu>
				</Dropdown>
				<p> Trier par : </p>
				<select>
					<option value="begin_date">Date</option>
					<option value="name">Nom</option>
					<option value="cost">Prix</option>
					<option value="place">Lieu</option>
				</select>
				<button>⇃↾</button>
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
