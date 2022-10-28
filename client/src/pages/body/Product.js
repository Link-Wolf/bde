import {useState, useEffect, React} from "react";

import b64ToBlob from "b64-to-blob";
import jszip from "jszip";

import style from "../../style/Product.module.scss";
import load from "../../assets/animations/gear_clockwise.gif";

const Product = props => {
	if (props.id === undefined) return;
	return (
		<>
			<div className={style.productContainer}>
				<div className={style.productFile}>
					<Album id={props.id} />
					<Description id={props.id} />
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
				console.log(
					`This is a fetch error: The error is ${error.message}`
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
								<img className={style.thumbnail} src={image} />
							</a>
						</li>
					))
				) : (
					<></>
				)}
			</ul>
			<img className={style.cover} src={album[displayedImage]} />
		</div>
	);
};

const Description = props => {
	const [product, setProduct] = useState({
		name: "█ █ █ █ ",
		cost: 42,
		available: true,
		desc: "█ █ █ █ "
	});

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
				setProduct(d);
				if (d.stock !== d.s + d.m + d.l + d.xl) setSize("stock");
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [props.id]);

	return (
		<div className={style.description}>
			<h1>{product.name}</h1>
			<p>{product.desc}</p>
			<div className={style.form}>
				{product.stock ===
					product.s + product.m + product.l + product.xl && (
					<div>
						{" "}
						<label>Taille :</label>
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
				)}
				<div>
					<label>Couleur :</label>
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
				</div>
			</div>
			<dl>
				<div>
					<dt>Stock pour ce choix :</dt>
					<dd>{product[size]}</dd>
				</div>
				<div id={style.price}>
					<dd>{product.cost.toFixed(2)}€</dd>
				</div>
			</dl>
		</div>
	);
};

export default Product;
