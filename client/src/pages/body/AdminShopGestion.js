import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminProductToken from "../../components/AdminProductToken";
import AdminCreateProductToken from "../../components/AdminCreateProductToken";
import {NotificationManager} from "react-notifications";

import style from "../../style/AdminShopgestion.module.scss";

import {Accordion, Button} from "react-bootstrap";

const AdminShopGestion = param => {
	const [data, setData] = useState([]);
	const [openProductId, setOpenProductId] = useState(-42);
	const [update, setUpdate] = useState(false);
	const [newProduct, setNewProduct] = useState(<></>);
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		setUpdate(false);
		const requestOptions = {
			method: "get",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		};
		fetch(`${process.env.REACT_APP_API_URL}/goodies`, requestOptions)
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
	}, [param.filter, openProductId, update]);

	const createNewProduct = () => {
		setNewProduct(
			<AdminCreateProductToken
				onClickRetract={() => setOpenProductId(-42)}
				onClickDeploy={() => setOpenProductId(-1)}
				cancel={() => setNewProduct(<></>)}
				setUpdate={d => {
					setUpdate(d);
					setNewProduct(<></>);
				}}
			/>
		);
		setOpenProductId(-1);
	};
	useEffect(() => {
		setRet(
			<div
				style={{
					display: "flex"
				}}
			>
				<AdminNavbar />
				<div className={style.shopGestionContainer}>
					<div id={style.tittle}>
						Gestion des <br /> produits
					</div>
					<Button onClick={createNewProduct}>New</Button>
					<Accordion>
						{newProduct}
						{data.map((item, i) => (
							<Accordion.Item eventKey={i} key={i}>
								<AdminProductToken
									data={item}
									index={i}
									key={i}
									open={openProductId}
									onClickRetract={() => setOpenProductId(-42)}
									onClickDeploy={() => setOpenProductId(i)}
									setUpdate={setUpdate}
								/>
							</Accordion.Item>
						))}
					</Accordion>
				</div>
			</div>
		);
	}, [data]);

	return ret;
};

export default AdminShopGestion;
