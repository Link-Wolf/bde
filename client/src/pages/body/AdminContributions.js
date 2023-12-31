import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {Button} from "react-bootstrap";
import AdminContribToken from "../../components/AdminContribToken";
import {NotificationManager} from "react-notifications";

import AdminCreateContributionToken from "../../components/AdminCreateContributionToken";

import style from "../../style/AdminContributions.module.scss";

const AdminContributions = () => {
	const [data, setData] = useState([]);
	const [update, setUpdate] = useState(false);
	const [form, setForm] = useState(<></>);
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		setUpdate(false);
		const requestOptions = {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		};
		fetch(`${process.env.REACT_APP_API_URL}/contribution`, requestOptions)
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
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
			<div className={style.contributionsContainer}>
				<div id={style.tittle}>Gestion des cotisations</div>
				<Button
					onClick={() => {
						setForm(<AdminCreateContributionToken />);
					}}
				>
					New
				</Button>
				{form}
				<div></div>
				{data.map((item, i) => (
					<AdminContribToken data={item} index={i} key={i} />
				))}
			</div>
		</div>
	);
};

export default AdminContributions;
