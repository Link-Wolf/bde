import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {Accordion, Button} from "react-bootstrap";
import AdminContribToken from "../../components/AdminContribToken";

const AdminContributions = () => {
	const [data, setData] = useState([]);
	const [update, setUpdate] = useState(false);

	useEffect(() => {
		setUpdate(false);
		const requestOptions = {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		};
		fetch(`http://localhost:4242/contribution`, requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setData(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [update]);

	const createNewContrib = () => {
		fetch(`http://localhost:4242/contribution/admin`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				studLogin: "[login]",
				cost: 0,
				begin_date: new Date(Date.now()),
				end_date: 0
			})
		});
		setUpdate(true);
	};

	return (
		<>
			<AdminNavbar />
			{data.length ? (
					data.map((item, i) => (
						<AdminContribToken data={item} index={i} key={i} />
					))

			) : (
				<div>No contributions found</div>
			)}
			<Button onClick={createNewContrib}>New</Button>
		</>
	);
};

export default AdminContributions;
