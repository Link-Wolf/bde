import {useEffect, useState} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const EventToken = param => {
	const [imgSrc, setImgSrc] = useState(null);

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/event/${param.event.id}/thumbnail`,
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
			<h2>
				{param.type == "album" ? (
					<>
						{new Date(param.event.begin_date).toLocaleDateString()}
						<p
							onClick={() => {
								param.setPopUpEvent(param.event.id);
							}}
						>
							{param.event.name}
						</p>
					</>
				) : (
					<>
						<p
							onClick={() => {
								param.setPopUpEvent(param.event.id);
							}}
						>
							{param.event.id}
							{new Date(
								param.event.begin_date
							).toLocaleDateString()}{" "}
							{param.event.name}
						</p>
					</>
				)}
			</h2>
			{param.type == "event" ? (
				<>
					<LazyLoadImage
						height="auto"
						src={imgSrc}
						width="150px"
						effect="blur"
					/>
					<p> {param.event.desc} </p>
				</>
			) : (
				<></>
			)}
		</>
	);
};

export default EventToken;
