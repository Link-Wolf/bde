import {useState, useEffect, React} from "react";

const EventList = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch(`http://localhost:4242/event/current`).then(response =>
			console.log(response)
		);
	}, []);

	const headers = [];

	//const events = [];

	const total = 3; //getCurrentsEvents().lenght;

	for (let index = 0; index < total; index++) {
		headers.push(<Header key={index} />);
	}

	console.log(headers);

	return <div>{headers}</div>;
};

export default EventList;

//
// 	return <div className="App">App</div>;
// }
