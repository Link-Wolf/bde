import {useEffect, useState} from "react";

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
			<h1>
				<a href={`/event/${param.event.id}`}>
					{param.event.name} :{" "}
					{new Date(param.event.begin_date).toLocaleDateString()}
				</a>
			</h1>
			<img src={imgSrc} width="150px" />
			<p> {param.event.desc} </p>
		</>
	);
};

export default EventToken;
