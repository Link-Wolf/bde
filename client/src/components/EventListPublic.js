import {React} from "react";

import style from "../style/EventList.module.scss";

const EventListPublic = param => {
	return (
		<div width="400px">
			<div>
				Barbecues, Loup-Garou, soirée d'intégration... La Frégate
				organise divers évènements en tant que BDE pour faire vivre et
				animer le campus !
			</div>
			<div>
				Étudiant à 42 ?{" "}
				<a href={`${process.env.REACT_APP_INTRA_REDIRECT}`}>
					Connectes-toi
				</a>{" "}
				pour en savoir plus sur les évènements actuels !
			</div>
		</div>
	);
};

export default EventListPublic;
