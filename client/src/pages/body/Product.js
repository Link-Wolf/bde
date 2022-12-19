import {useState, useEffect, React} from "react";
import {NotificationManager} from "react-notifications";

import b64ToBlob from "b64-to-blob";
import jszip from "jszip";

import style from "../../style/Product.module.scss";
import load from "../../assets/animations/gear_clockwise.gif";

const Product = props => {
	const [product, setProduct] = useState({
		name: "",
		cost: 42,
		available: true,
		desc: ""
	});
	if (props.id === undefined) return;
	return (
		<>
			<div className={style.productContainer}>
				<div className={style.productFile}>
					<h1 id={style.phoneH1}>{product.name}</h1>
					<Album id={props.id} />
					<Description
						session={props.session}
						id={props.id}
						product={product}
						setProduct={setProduct}
					/>
				</div>
				<div id={style.exit}>
					<button
						id={style.exitButton}
						onClick={() => props.setPopUp(-1)}
					>
						Quitter
					</button>
				</div>
			</div>
		</>
	);
};

const Album = props => {
	const [album, setAlbum] = useState([load]);
	const [displayedImage, setDisplayedImage] = useState(0);
	const [refAlbum, setRefAlbum] = useState(0);

	useEffect(() => {
		if (props.id == undefined || !props.id) return;
		fetch(`${process.env.REACT_APP_API_URL}/goodies/${props.id}/album`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.text();
			})
			.then(zipAsBase64 => {
				const blob = b64ToBlob(zipAsBase64, "application/zip");
				return blob;
			})
			.then(async arrayBuffer => {
				await jszip.loadAsync(arrayBuffer).then(({files}) => {
					const mediaFiles = Object.entries(
						files
					).filter(([fileName]) => fileName.endsWith(""));

					if (!mediaFiles.length) {
						throw new Error("No media files found in archive");
					}

					mediaFiles.forEach(async ([, image], i) => {
						await image
							.async("blob")
							.then(blob => {
								let tmp = album;
								tmp[i] = URL.createObjectURL(blob);
								setAlbum(tmp);
							})
							.then(async () => {
								await new Promise(res => setTimeout(res, 200));
								setRefAlbum(refAlbum + 1);
							});
					});
				});
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [props.id]);

	return (
		<div className={style.album}>
			<ul>
				{album.length && refAlbum ? (
					album.map((image, i) => (
						<li key={i}>
							<a
								onMouseOver={() => {
									setDisplayedImage(i);
								}}
								onClick={() => {
									setDisplayedImage(i);
								}}
							>
								<img alt="" className={style.thumbnail} src={image} />
							</a>
						</li>
					))
				) : (
					<></>
				)}
			</ul>
			<img alt=""
				className={style.cover}
				id={album[displayedImage] === load ? style.load : ""}
				src={album[displayedImage]}
			/>
		</div>
	);
};

const Description = props => {
	const [size, setSize] = useState("m");

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/goodies/${props.id}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(d => {
				props.setProduct(d);
				if (d.stock !== d.s + d.m + d.l + d.xl) setSize("stock");
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [props.id]);

	return (
		<div className={style.description}>
			<h1 id={style.deskH1}>{props.product.name}</h1>
			<div className={style.p}>
				{props.product.desc.split("\n").map((line, i) => (
					<p eventKey={i}>{line}</p>
				))}
			</div>
			{props.session.clearance > 2 && props.session !== 0 ? (
				<>
					<p id={style.warn}>
						Ce produit ne peut être acheté que physiquement sur
						place auprès d'un membre du BDE.
					</p>
					<p id={style.warn}>
						Tu ne trouves pas ta taille ? Demande la nous vite{" "}
						<a href="/contact">ici</a> avant la prochaine commande !
					</p>
				</>
			) : (
				<></>
			)}
			<div className={style.form}>
				{props.product.stock ===
					props.product.s +
						props.product.m +
						props.product.l +
						props.product.xl && props.product.stock !== 0 ? (
					<div>
						{" "}
						<label>Taille</label>
						<select
							value={size}
							onChange={e => {
								setSize(e.target.value);
							}}
						>
							<option value="s">S</option>
							<option value="m">M</option>
							<option value="l">L</option>
							<option value="xl">XL</option>
						</select>
					</div>
				) : (
					<div></div>
				)}
				<div>
					{props.product.stock ? (
						<>
							<label>Coloris</label>
							<input
								type="radio"
								name="color"
								value="black"
								id="colorBlack"
								defaultChecked
							/>
							<label
								htmlFor="colorBlack"
								style={{"--my-color": "#000000"}}
							/>
						</>
					) : (
						""
					)}
				</div>
			</div>
			<dl>
				<div>
					{props.product.stock ? (
						<>
							<dt>Stock pour ce choix</dt>
							<dd id={style.rest}>
								{props.product[size] == 0 ? (
									<>
										Rupture, réserve ta pièce en nous le
										disant <a href="/contact">ici</a> !
									</>
								) : (
									<>
										{props.product[size]}{" "}
										{props.product[size] > 1
											? "pièces restantes"
											: "pièce restante"}
									</>
								)}
							</dd>
						</>
					) : props.product.stock !== undefined ? (
						<div>
							<dt id={style.rupture}>Rupture de stock</dt>
							<dt id={style.ruptureContact}>
								Faites nous en part <a href="/contact">ici</a> !
							</dt>
						</div>
					) : (
						""
					)}
				</div>
				{props.session.clearance > 2 && props.session !== 0 ? (
					<>
						<div id={style.price}>
							<dd>{props.product.cost.toFixed(2)}€</dd>
						</div>
					</>
				) : (
					<></>
				)}
			</dl>
		</div>
	);
};

export default Product;
