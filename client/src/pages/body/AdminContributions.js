import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {Button} from "react-bootstrap";
import AdminContribToken from "../../components/AdminContribToken";

import AdminCreateContributionToken from "../../components/AdminCreateContributionToken";

const AdminContributions = () => {
	const [data, setData] = useState([]);
	const [update, setUpdate] = useState(false);
	const [form, setForm] = useState(<></>);
	useEffect(() => {
		setUpdate(false);
		const requestOptions = {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		};
		fetch(
			`http://${global.config.api.authority}/contribution`,
			requestOptions
		)
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

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div>
				{data.length ? (
					data.map((item, i) => (
						<AdminContribToken data={item} index={i} key={i} />
					))
				) : (
					<div>No contributions found</div>
				)}
				<Button
					onClick={() => {
						setForm(<AdminCreateContributionToken />);
					}}
				>
					New
				</Button>
				{form}
			</div>
		</div>
	);
};

export default AdminContributions;
