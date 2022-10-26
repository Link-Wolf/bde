import {React, useState, useEffect} from "react";
import usePagination from "../../components/Pagination";
import {Pagination} from "@mui/material";

const Clubs = () => {
	const [clubs, setClubs] = useState([]);
	const PER_PAGE = 5;
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const viewData = usePagination(clubs, PER_PAGE);
	const [load, setLoad] = useState(false);

	useEffect(() => {
		setLoad(true);
		fetch(`${process.env.REACT_APP_API_URL}/club`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is` +
							` ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setClubs(actualData);
				viewData.updateData(actualData);
				let tmp = Math.ceil(actualData.length / PER_PAGE);
				return tmp;
			})
			.then(tmp => {
				if (tmp < count) {
					setPage(1);
					viewData.jump(1);
				}
				return tmp;
			})
			.then(tmp => {
				setCount(tmp);
				setLoad(false);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	const handleChangePage = (e, p) => {
		setPage(p);
		viewData.jump(p);
	};

	return load ? (
		<div>Chargement ...</div>
	) : clubs.length ? (
		<>
			<div>
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
				{clubs.length > 0 && (
					<ul>
						{viewData.currentData().map(club => (
							<li key={club.id}>
								<ul>
									<li>{club.name}</li>
									<li>{club.desc}</li>
									<li>{club.cost}</li>
									<li>{club.access}</li>
									<li>{club.goal}</li>
									<li>{club.link}</li>
									<li>{club.details}</li>
									<li>{club.login}</li>
								</ul>
							</li>
						))}
					</ul>
				)}
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
			</div>
			<div>
				Envie de créer un club ? <a href="/contact">Dites le nous</a>
			</div>
		</>
	) : (
		<>
			<div>Aucun club actuellement disponibles</div>
			<div>
				Mais pas d'inquiétude ! Venez créer le votre dès maintenant en
				nous <a href="/contact">contactant</a>
			</div>
		</>
		// <div>
		// 	<div>
		// 		<h1>Club DIY (LabHidouille)</h1>
		// 		<h2>
		// 			Espace d'innovation sur le thème du soutien à l'autonomie et
		// 			à l'inclusion sociale
		// 		</h2>
		// 		<div>
		// 			<ul>
		// 				<li>Gratuit</li>
		// 				<li>Ouvert à tous</li>
		// 				<li>
		// 					Vous pourrez y découvrir et développer les projets
		// 					que vous souhaitez grâce à leur différents outils
		// 					(imprimantes 3D, découpeuse laser, fraiseuse CNC,
		// 					Arduino ...)
		// 				</li>
		// 			</ul>
		// 		</div>
		// 		<p>Contact : Jean Michel (jrasser)</p>
		// 		<p>Site : https://www.labhidouille.fr/</p>
		// 		<p>
		// 			[FAQ FabLab] Nos projets doivent-ils être en lien avec les
		// 			projets de LabHidouille ? Non, vous pouvez réaliser tout
		// 			types de projets indépendant. Les projets sont-ils
		// 			obligatoirement en groupes ? Non, vous pouvez réaliser vos
		// 			projets perso. Des projets de groupes seront proposes. A
		// 			t'on un accès libre au FabLab ? Il faut être membre du Club
		// 			DIY et réserver un créneau sur leur site. Les places dans un
		// 			groupe sont limitées (détails à venir). L'utilisation des
		// 			machines sont-elles gratuites ? Oui les machines sont a
		// 			disposition gratuitement. Les machines sont-elles en libre
		// 			service? Apres une courte formation, vous pouvez utiliser
		// 			les machines en autonomie. Les consommables sont-ils gratuit
		// 			(filament 3D, boiserie, fraise... )? 42 prend en charge une
		// 			partie des consommables (filament 3D, étains, liste à
		// 			définir). Le reste est à votre charge. Concernant
		// 			l'électronique ? Les systèmes embarqués type Arduino sont à
		// 			disposition le temps de votre projet. Pour les consommables
		// 			de types LED, boutons, resistances, etc..., rien n'est
		// 			encore défini.
		// 		</p>
		// 	</div>
		// 	<div>
		// 		Envie de créer un club ? <a href="/contact">Dites le nous</a>
		// 	</div>
		// </div>
	);
};

export default Clubs;
