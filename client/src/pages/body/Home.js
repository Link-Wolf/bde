import {React} from "react";
import EventList from "../../components/EventList";
import ShowcaseCarousel from "../../components/ShowcaseCarousel";

import style from "../../style/Home.module.css";

const Home = () => {
	const getStock = () => {
		fetch(`http://${global.config.api.authority}/google`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is` +
							` ${response.status}`
					);
				}
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

	return (
		<div>
			<button onClick={getStock}>Test api google</button>
			<p className={style.p}>
				[Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
				et ante sit amet diam venenatis laoreet nec dictum risus. Ut
				sagittis sem ac dui scelerisque, vel commodo nunc pellentesque.
				Etiam sit amet dapibus nisi. Donec bibendum pulvinar augue, vel
				varius elit efficitur sit amet. Pellentesque vel massa et leo
				sagittis dignissim nec sed massa. In congue luctus nunc vel
				tincidunt. Suspendisse a lobortis nisi, tincidunt varius odio.
				Sed accumsan blandit libero non euismod. Donec vehicula orci sit
				aliquam lacus sit amet odio mattis fringilla. Donec aliquam
				vulputate ex a posuere. Etiam in mi ut risus venenatis mollis eu
				quis nibh. Proin ultrices enim interdum dui sollicitudin
				sagittis. Nam a faucibus leo, vitae fringilla odio. Maecenas vel
				ipsum ullamcorper, euismod erat pulvinar, mollis lacus. Nulla in
				fermentum felis. Vivamus ornare nisi mollis purus blandit, nec
				fermentum nibh finibus. Nulla sit amet venenatis augue. Cras ac
				lorem vitae sem rutrum dapibus. In vel facilisis velit. Nam
				dictum convallis massa nec luctus. Integer at ipsum sed massa
				tempus blandit aliquet vel magna. Cras semper malesuada elit,
				quis rhoncus diam ornare vitae. Nam purus metus, pellentesque id
				pulvinar et, accumsan eu lectus. Sed porttitor.]
			</p>
			<div className={style.event_show}>
				<ShowcaseCarousel />
				<div className={style.margin5}>
					<EventList filter={{current: 1}} />
				</div>
			</div>
			<p className={style.p}>
				[Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
				et ante sit amet diam venenatis laoreet nec dictum risus. Ut
				sagittis sem ac dui scelerisque, vel commodo nunc pellentesque.
				Etiam sit amet dapibus nisi. Donec bibendum pulvinar augue, vel
				varius elit efficitur sit amet. Pellentesque vel massa et leo
				sagittis dignissim nec sed massa. In congue luctus nunc vel
				quam. Integer aliquam neque at pellentesque condimentum. Quisque
				a vulputate odio. Etiam eu luctus ante. Pellentesque et ex enim.
				Maecenas fermentum diam sed tincidunt tristique. Sed ac mollis
				metus, in dapibus nibh. Quisque venenatis facilisis ex sed
				dapibus. Duis ac diam non orci facilisis fringilla. Maecenas
				imperdiet convallis tortor non ullamcorper. Cras eros arcu,
				dignissim at eros et, euismod eleifend neque. Maecenas suscipit
				semper quam, ut congue risus dictum ac. In a dignissim nunc.
				Curabitur hendrerit vel mi vel facilisis. Nunc sollicitudin
				ullamcorper ante, viverra vulputate enim sollicitudin nec. Nunc
				aliquam lacus sit amet odio mattis fringilla. Donec aliquam
				vulputate ex a posuere. Etiam in mi ut risus venenatis mollis eu
				quis nibh. Proin ultrices enim interdum dui sollicitudin
				sagittis. Nam a faucibus leo, vitae fringilla odio. Maecenas vel
				ipsum ullamcorper, euismod erat pulvinar, mollis lacus. Nulla in
				fermentum felis. Vivamus ornare nisi mollis purus blandit, nec
				fermentum nibh finibus. Nulla sit amet venenatis augue. Cras ac
				lorem vitae sem rutrum dapibus. In vel facilisis velit. Nam
				dictum convallis massa nec luctus. Integer at ipsum sed massa
				tempus blandit aliquet vel magna. Cras semper malesuada elit,
				quis rhoncus diam ornare vitae. Nam purus metus, pellentesque id
				pulvinar et, accumsan eu lectus. Sed porttitor.]
			</p>
		</div>
	);
};

export default Home;
