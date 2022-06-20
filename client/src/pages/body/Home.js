import React from "react";

function Home() {
	return (
		<div>
			<div>
				Ouais salut c'est le BDE
				<br /> Ici on est pas la pour faire des oeufs
				<br />
				Alors accroche toi bien a ton iMac
				<br />
				Parce qu'on va casser la baraque
			</div>
			<div> [ Album custom all events dans le petit carroussel ]</div>
			<div>
				Events en cours et a venir
				<ul>
					<EventList />
				</ul>
			</div>
		</div>
	);
}

export default Home;
