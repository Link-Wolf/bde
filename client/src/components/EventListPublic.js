import {React} from "react";

import style from "../style/EventListPublic.module.scss";
import patchwork from "../assets/images/events.webp";

const EventListPublic = param => {
	return (
		<div className={style.container}>
			<p>Barbecues, Loup-Garou, soirée d'intégration...</p>
			<p>
				La Frégate organise divers évènements en tant que BDE pour faire
				vivre et animer le campus !
			</p>
			<img alt="" src={patchwork} />
			<p>
				Étudiant à 42 ?{" "}
				<a href={`${process.env.REACT_APP_INTRA_REDIRECT}`}>
					Connecte-toi
				</a>{" "}
				pour en savoir plus sur les évènements actuels !
			</p>
		</div>
	);
};

export default EventListPublic;
