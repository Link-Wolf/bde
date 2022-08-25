import {useState, useEffect, React} from "react";
import {Placeholder} from "react-bootstrap";
import ShopToken from "./ShopToken";

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
		fetch(`http://${global.config.api.authority}/goodies`, requestOptions)
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
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
