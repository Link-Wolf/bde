import {useState, useRef, useEffect, React} from "react";
import {useParams} from "react-router-dom";
import b64ToBlob from "b64-to-blob";
import jszip from "jszip";
import {LazyLoadImage} from "react-lazy-load-image-component";

import ProductList from "../../components/ProductList";

import style from "../../style/Product.module.scss";

import load from "../../assets/animations/gear_clockwise.gif";

const Product = () => {
	const params = useParams();

	if (params.id === undefined) return;
	return (
		<>
			<div className={style.productContainer}>
				<div className={style.productFile}>
					<Album id={params.id} />
					<Description id={params.id} />
				</div>
				<OtherProducts />
			</div>
		</>
	);
};

const Album = param => {
	const [album, setAlbum] = useState([load]);
	const [displayedImage, setDisplayedImage] = useState(0);
	const [refAlbum, setRefAlbum] = useState(0);

	useEffect(() => {
		if (param.id == undefined || !param.id) return;
		fetch(`${process.env.REACT_APP_API_URL}/goodies/${param.id}/album`, {
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
	}, [param.id]);

	return (
		<div className={style.album}>
			<ul>
				{album.length && refAlbum ? (
					album.map((image, i) => (
						<li key={i}>
							<a
								onClick={() => {
									setDisplayedImage(i);
								}}
							>
								<LazyLoadImage
									height="auto"
									className={style.thumbnail}
									src={image}
									width="auto"
									effect="blur"
								/>
							</a>
						</li>
					))
				) : (
					<></>
				)}
			</ul>
			<LazyLoadImage
				height="auto"
				className={style.cover}
				src={album[displayedImage]}
				width="auto"
				effect="blur"
			/>
		</div>
	);
};

const Description = param => {
	const [product, setProduct] = useState({
		name: "█ █ █ █ ",
		cost: 42,
		available: true,
		desc: "█ █ █ █ "
	});

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/goodies/${param.id}`, {
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
				console.log(d);
				setProduct(d);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [param.id]);

	return (
		<div className={style.description}>
			<h1>{product.name}</h1>
			<p>{product.desc}</p>
			<ul>
				<li>
					<div className={style.price}>
						Prix: {product.cost.toFixed(2)}
					</div>
				</li>
				<li>
					{product.stock ? (
						product.stock ===
						product.s + product.m + product.l + product.xl ? (
							<div className={style.dispo}>
								Disponible dans les tailles et quantités
								suivantes :
								<div className={style.tailles}>
									<div>S : {product.s}</div>
									<div>M : {product.m}</div>
									<div>L : {product.l}</div>
									<div>XL : {product.xl}</div>
								</div>
							</div>
						) : (
							<div className={style.dispo}>
								Disponible ({product.stock} restants)
							</div>
						)
					) : (
						"En rupture de stock :c"
					)}
				</li>
			</ul>
		</div>
	);
};

const OtherProducts = () => {
	return <ProductList />;
};

export default Product;
