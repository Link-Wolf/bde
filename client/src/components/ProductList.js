import {useState, useEffect, React} from "react";

import ShopToken from "./ShopToken";

import style from "../style/ProductList.module.css";

const ProductList = param => {
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
	});

	return data.length ? (
		<div className={style.scroll_container_40vw}>
			{data.map(item => (
				<li key={item.id}>
					<ShopToken goodies={item} />
				</li>
			))}
		</div>
	) : (
		<div>No goodies available</div>
	);
};

export default ProductList;
