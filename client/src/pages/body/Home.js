import {React, useState} from "react";
import EventList from "../../components/EventList";
import CheckSet from "../../components/CheckSet";

import style from "../../style/Home.module.scss";
import frontImage from "../../assets/images/front.jpg";

const Home = () => {
	const [filter, setFilter] = useState({
		current: true,
		free: false,
		available: false,
		food: false,
		unlimited: false,
		outside: false,
		sponso: false,
		sort: "begin_date",
		asc: false,
		available_date: true
	});

	return (
		<div className={style.homeContainer}>
			<HeaderHome />
			<Filter filter={filter} setFilter={setFilter} />
			<EventList filter={filter} showCount />
		</div>
	);
};

const HeaderHome = () => {
	return (
		<div className={style.frontImage}>
			<img src={frontImage} />
			<div className={style.color} />
			<div className={style.text}>
				<h1>BDE 42 Mulhouse</h1>
			</div>
		</div>
	);
};

const Filter = param => {
	const handleFormChange = event => {
		let tempFilter = {...param.filter};
		const target = event.target;
		const value =
			target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		tempFilter[name] = value;
		param.setFilter(tempFilter);
	};

	return (
		<div className={style.events}>
			<CheckSet
				hidden
				set={[
					{
						label: "Free",
						name: "free",
						checked: param.filter.free
					},
					{
						label: "Available",
						name: "available",
						checked: param.filter.available
					},
					{
						label: "Miammiam glouglou",
						name: "food",
						checked: param.filter.food
					},
					{
						label: "Dehors",
						name: "outside",
						checked: param.filter.outside
					},
					{
						label: "Places illimitées",
						name: "unlimited",
						checked: param.filter.unlimited
					},
					{
						label: "Sponsorisé",
						name: "sponso",
						checked: param.filter.sponso
					}
				]}
				onChange={handleFormChange}
				type="checkbox"
			/>
		</div>
	);
};

export default Home;

// const getStock = () => {
// 	fetch(`http://${global.config.api.authority}/google`, {
// 		credentials: "include"
// 	})
// 		.then(response => {
// 			if (!response.ok) {
// 				throw new Error(
// 					`This is an HTTP error: The status is` +
// 						` ${response.status}`
// 				);
// 			}
// 		})
// 		.catch(function(error) {
// 			console.log(
// 				"Il y a eu un problème avec l'opération fetch: " +
// 					error.message
// 			);
// 		});
// };
