import {useSearchParams} from "react-router-dom";
import {useState, useEffect} from "react";

const Log = () => {
	const [searchParams] = useSearchParams();
	const [data, setData] = useState({});

	useEffect(() => {
		const code = searchParams.get("code");
		const requestOptions = {
			method: "post",
			headers: {"Content-Type": "application/json"}, //add security token here i guess
			body: JSON.stringify({
				code: code
			})
		};
		fetch("http://k1r2p10.42mulhouse.fr:4242/auth", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				console.log(actualData);
				setData(actualData);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
		console.log(data);
	}, []);
};

export default Log;
