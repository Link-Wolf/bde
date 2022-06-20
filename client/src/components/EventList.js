import {useState, useEffect, React} from "react";

const EventList = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch(`http://localhost:4242/event/current`)
			.then(response => response.json())
			.then(actualData => console.log(actualData))
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	// const headers = [];
	//
	// //const events = [];
	//
	// const total = 3; //getCurrentsEvents().lenght;
	//
	// for (let index = 0; index < total; index++) {
	// 	headers.push(<Header key={index} />);
	// }
	//
	// console.log(headers);
	//
	return <div>Pouet</div>;
};

export default EventList;

//
// return <div className="App">App</div>;
// }
