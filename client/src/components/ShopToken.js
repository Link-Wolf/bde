import {useEffect, useState} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {NotificationManager} from "react-notifications";

const ShopToken = param => {
	const [imgSrc, setImgSrc] = useState(null);

	useEffect(() => {
		fetch(
			`${process.env.REACT_APP_API_URL}/goodies/${param.goodies.id}/thumbnail`,
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
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
			<LazyLoadImage
				height="150px"
				src={imgSrc}
				width="auto"
				effect="blur"
			/>
			<p>
				{param.goodies.available
					? `${param.goodies.cost} euros / ${param.goodies.desc}`
					: "PAS DISPO MON BRO"}
			</p>
		</>
	);
};

export default ShopToken;
