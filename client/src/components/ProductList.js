import {useState, useEffect, React} from "react";
import {Placeholder} from "react-bootstrap";
import ShopToken from "./ShopToken";
import {NotificationManager} from "react-notifications";

import style from "../style/ProductList.module.css";
import grey from "../assets/placeholders/grey.png";

const ProductList = () => {
	const [ret, setRet] = useState(
		<div className={style.scroll_container_40vw}>
			<Placeholder as="h1" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<img src={grey} width="150px" />
			<Placeholder as="p" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<Placeholder as="h1" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<img src={grey} width="150px" />
			<Placeholder as="p" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<Placeholder as="h1" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<img src={grey} width="150px" />
			<Placeholder as="p" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
		</div>
	);
	const [data, setData] = useState([]);

	useEffect(() => {
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
					setRet(<div>No goodies available</div>);
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
	}, []);
	useEffect(() => {
		setRet(
			<div className={style.scroll_container_40vw}>
				{data.map(item => (
					<li key={item.id}>
						<ShopToken goodies={item} />
					</li>
				))}
			</div>
		);
	}, [data]);

	return ret;
};

export default ProductList;
