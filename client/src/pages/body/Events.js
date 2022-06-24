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
						Filtrer
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<CheckSet
							set={[
								{name: "Current", value: "current"},
								{name: "Free", value: "free"},
								{name: "Available", value: "available"}
							]}
							onChange={null}
							type="checkbox"
						/>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						Tri
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<CheckSet
							set={[
								{
									name: "Begin Date",
									value: "begin_date",
									defaultChecked: true
								},
								{name: "End Date", value: "end_date"},
								{name: "ID", value: "id"},
								{name: "Nombre de place", value: "nb_places"},
								{name: "Nom", value: "name"},
								{name: "Lieu", value: "place"},
								{name: "Prix", value: "cost"}
							]}
							onChange={null}
							type="radio"
						/>
						<hr />
						<CheckSet
							set={[
								{
									name: "Desc",
									value: "desc",
									defaultChecked: true
								},
								{name: "Asc", value: "asc"}
							]}
							onChange={null}
							type="radio"
						/>
					</Dropdown.Menu>
				</Dropdown>
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
