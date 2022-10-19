import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminClubToken from "../../components/AdminClubToken";
import AdminCreateClubToken from "../../components/AdminCreateClubToken";

import {Accordion, Button} from "react-bootstrap";

const AdminClubs = param => {
	const [data, setData] = useState([]);
	const [openClubId, setOpenClubId] = useState(-42);
	const [update, setUpdate] = useState(false);
	const [newClub, setNewClub] = useState(<></>);

	useEffect(() => {
		setUpdate(false);
		const requestOptions = {
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		};
		fetch(`http://${global.config.api.authority}/club`, requestOptions)
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
				console.log(actualData);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [param.filter, openClubId, update]);

	const createNewClub = () => {
		setNewClub(
			<AdminCreateClubToken
				onClickRetract={() => setOpenClubId(-42)}
				onClickDeploy={() => setOpenClubId(-1)}
				cancel={() => setNewClub(<></>)}
				setUpdate={d => {
					setUpdate(d);
					setNewClub(<></>);
				}}
			/>
		);
		setOpenClubId(-1);
	};

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div>
				<Button onClick={createNewClub}>New</Button>
				<Accordion>
					{newClub}
					{data.map((item, i) => {
						return (
							<Accordion.Item eventKey={i} key={i}>
								<AdminClubToken
									data={item}
									index={i}
									key={i}
									open={openClubId}
									onClickRetract={() => setOpenClubId(-42)}
									onClickDeploy={() => setOpenClubId(i)}
									setUpdate={d => {
										setUpdate(d);
									}}
								/>
							</Accordion.Item>
						);
					})}
				</Accordion>
			</div>
		</div>
	);
};
export default AdminClubs;
