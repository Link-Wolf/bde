import {useEffect, useState} from "react";

const ShopToken = param => {
	const [imgSrc, setImgSrc] = useState(null);

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/goodies/${param.goodies.id}/thumbnail`,
			{
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is` +
							` ${response.status}`
					);
				}
				return response.blob();
			})
			.then(blob => {
				setImgSrc(URL.createObjectURL(blob));
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	return (
		<>
			<h1>
				<a href={`/product/${param.goodies.id}`}>
					{param.goodies.name}
				</a>
			</h1>
			<img src={imgSrc} width="150px" />
			<p>
				{param.goodies.available
					? `${param.goodies.cost} euros / ${param.goodies.desc}`
					: "PAS DISPO MON BRO"}
			</p>
		</>
	);
};

export default ShopToken;
