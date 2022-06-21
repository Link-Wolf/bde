import React from "react";
import EventList from "../../components/EventList";
import EventCarousel from "../../components/EventCarousel";

import "../../style/Home.css";

function Home() {
	return (
		<div>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
				et ante sit amet diam venenatis laoreet nec dictum risus. Ut
				sagittis sem ac dui scelerisque, vel commodo nunc pellentesque.
				Etiam sit amet dapibus nisi. Donec bibendum pulvinar augue, vel
				varius elit efficitur sit amet. Pellentesque vel massa et leo
				sagittis dignissim nec sed massa. In congue luctus nunc vel
				tincidunt. Suspendisse a lobortis nisi, tincidunt varius odio.
				Sed accumsan blandit libero non euismod. Donec vehicula orci sit
				amet iaculis luctus. Fusce tempor dolor ut ornare mattis.
				Interdum et malesuada fames ac ante ipsum primis in faucibus.
				Nunc ut diam nec est condimentum tristique. In facilisis tellus
				vehicula, blandit nisi porttitor, facilisis elit. Morbi sed
				malesuada sem. Nullam congue pulvinar dignissim. Nunc semper
				odio libero, sagittis pharetra lorem hendrerit gravida. Quisque
				mi risus, consectetur a ornare ut, faucibus vel augue. Quisque
				sodales lacus elit, id tempor tortor efficitur vel. Sed sem
				nulla, sodales quis est mattis, gravida elementum tellus. Nulla
				facilisi. Lorem ipsum dolor sit amet, consectetur adipiscing
				elit. Aliquam tristique nunc eget nisl varius, sit amet
				pellentesque enim vulputate. Duis sit amet eros ac erat pulvinar
				pulvinar. Nam eget vehicula ante, in ullamcorper tortor. Mauris
				posuere elit tortor, vel finibus tellus posuere ut. Vivamus quis
				orci magna. Proin euismod augue non leo ultrices, in ultricies
				sapien porttitor. Cras dignissim lorem non erat facilisis, ut
				feugiat mauris tincidunt. Suspendisse potenti. Nam vitae dictum
				lectus. Ut elit nunc, finibus at enim eget, ultrices iaculis
				justo. Fusce egestas suscipit sodales. Nulla massa nulla,
				venenatis in sem sed, tincidunt iaculis augue. In hac habitasse
				platea dictumst. Praesent ornare tellus egestas urna tincidunt,
				ut eleifend tortor tempus. Vivamus ut massa condimentum nulla
				tempus bibendum. Duis nec nibh lacinia, aliquet ante at,
				imperdiet mi. Morbi vel tortor non velit interdum congue sed vel
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
				pulvinar et, accumsan eu lectus. Sed porttitor.
			</p>
			<div className="poem">
				<p>Ouais salut c'est le BDE</p>
				<p>Ici on est pas la pour faire des oeufs</p>
				<p>Alors accroche toi bien a ton iMac</p>
				<p>Parce qu'on va casser la baraque</p>
			</div>
			<div className="horizontal_div_home">
				<EventCarousel />
				<div>
					Events en cours et a venir
					<EventList />
				</div>
			</div>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
				et ante sit amet diam venenatis laoreet nec dictum risus. Ut
				sagittis sem ac dui scelerisque, vel commodo nunc pellentesque.
				Etiam sit amet dapibus nisi. Donec bibendum pulvinar augue, vel
				varius elit efficitur sit amet. Pellentesque vel massa et leo
				sagittis dignissim nec sed massa. In congue luctus nunc vel
				tincidunt. Suspendisse a lobortis nisi, tincidunt varius odio.
				Sed accumsan blandit libero non euismod. Donec vehicula orci sit
				amet iaculis luctus. Fusce tempor dolor ut ornare mattis.
				Interdum et malesuada fames ac ante ipsum primis in faucibus.
				Nunc ut diam nec est condimentum tristique. In facilisis tellus
				vehicula, blandit nisi porttitor, facilisis elit. Morbi sed
				malesuada sem. Nullam congue pulvinar dignissim. Nunc semper
				odio libero, sagittis pharetra lorem hendrerit gravida. Quisque
				mi risus, consectetur a ornare ut, faucibus vel augue. Quisque
				sodales lacus elit, id tempor tortor efficitur vel. Sed sem
				nulla, sodales quis est mattis, gravida elementum tellus. Nulla
				facilisi. Lorem ipsum dolor sit amet, consectetur adipiscing
				elit. Aliquam tristique nunc eget nisl varius, sit amet
				pellentesque enim vulputate. Duis sit amet eros ac erat pulvinar
				pulvinar. Nam eget vehicula ante, in ullamcorper tortor. Mauris
				posuere elit tortor, vel finibus tellus posuere ut. Vivamus quis
				orci magna. Proin euismod augue non leo ultrices, in ultricies
				sapien porttitor. Cras dignissim lorem non erat facilisis, ut
				feugiat mauris tincidunt. Suspendisse potenti. Nam vitae dictum
				lectus. Ut elit nunc, finibus at enim eget, ultrices iaculis
				justo. Fusce egestas suscipit sodales. Nulla massa nulla,
				venenatis in sem sed, tincidunt iaculis augue. In hac habitasse
				platea dictumst. Praesent ornare tellus egestas urna tincidunt,
				ut eleifend tortor tempus. Vivamus ut massa condimentum nulla
				tempus bibendum. Duis nec nibh lacinia, aliquet ante at,
				imperdiet mi. Morbi vel tortor non velit interdum congue sed vel
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
				pulvinar et, accumsan eu lectus. Sed porttitor.
			</p>
		</div>
	);
}

export default Home;
