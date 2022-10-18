import {React} from "react";
import EventList from "../../components/EventList";
import ShowcaseCarousel from "../../components/ShowcaseCarousel";

import style from "../../style/Home.module.scss";
import frontImage from "../../assets/images/front.jpg";

const Home = () => {
	return (
		<div className={style.homeContainer}>
			<div className={style.frontImage}>
				<img src={frontImage} />
				<div>
					<h1>BDE 42 Mulhouse</h1>
				</div>
			</div>
		</div>
	);
};

export default Home;

// const getStock = () => {
// 	fetch(`http://${global.config.api.authority}/google`, {
// 		credentials: "include"
// 	})
// 		.then(response => {
// 			if (!response.ok) {
// 				throw new Error(
// 					`This is an HTTP error: The status is` +
// 						` ${response.status}`
// 				);
// 			}
// 		})
// 		.catch(function(error) {
// 			console.log(
// 				"Il y a eu un problème avec l'opération fetch: " +
// 					error.message
// 			);
// 		});
// };
