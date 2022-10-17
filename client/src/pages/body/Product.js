import {useState, useEffect, React} from "react";
import {useParams} from "react-router-dom";
import b64ToBlob from "b64-to-blob";
import jszip from "jszip";

import ProductList from "../../components/ProductList";

import style from "../../style/Product.module.scss";

import placeHolder1 from "../../assets/placeholders/abel.png";
import placeHolder2 from "../../assets/placeholders/imane.png";
import placeHolder3 from "../../assets/placeholders/caroline.png";
import placeHolder4 from "../../assets/placeholders/yohan.png";

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
	const [album, setAlbum] = useState([
		placeHolder1,
		placeHolder2,
		placeHolder3,
		placeHolder4
	]);
	const [displayedImage, setDisplayedImage] = useState(0);

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/goodies/${param.id}/album`,
			{
				credentials: "include"
			}
		)
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
			.then(arrayBuffer => {
				jszip.loadAsync(arrayBuffer).then(({files}) => {
					const mediaFiles = Object.entries(
						files
					).filter(([fileName]) => fileName.endsWith(".jpg"));

					if (!mediaFiles.length) {
						throw new Error("No media files found in archive");
					}

					mediaFiles.forEach(([, image], i) => {
						image.async("blob").then(blob => {
							let tmp = album;
							tmp[i] = URL.createObjectURL(blob);
							setAlbum(tmp);
						});
					});
				});
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, []);

	return (
		<div className={style.album}>
			<ul>
				{album.map((image, i) => (
					<li key={i}>
						<a
							onClick={() => {
								setDisplayedImage(i);
							}}
						>
							<img className={style.thumbnail} src={image} />
						</a>
					</li>
				))}
			</ul>
			<img className={style.cover} src={album[displayedImage]} />
		</div>
	);
};

const Description = param => {
	const [product, setProduct] = useState({
		name: "Bocal",
		price: 42.42,
		available: true,
		desc:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultricies dui vitae orci elementum volutpat. Quisque et nisi efficitur, ullamcorper purus ac, rutrum mi. Morbi dictum pulvinar nibh, non euismod nisl fermentum in. Nulla eros lectus, porta nec orci et, sollicitudin ultrices mi. Maecenas quis erat blandit, rutrum sapien ut, auctor ipsum. Vivamus imperdiet id sapien eget convallis. Nulla accumsan erat lorem, blandit malesuada magna elementum ac. Sed nec libero bibendum, blandit ipsum in, rutrum augue. Donec et dolor dui. Nulla facilisi. Praesent elementum purus vitae enim rutrum, at laoreet lacus ultrices. "
	});

	return (
		<div className={style.description}>
			<h1>{product.name}</h1>
			<p>{product.desc}</p>
			<ul>
				<li>Prix: {product.price}</li>
				<li>
					{product.available
						? "Disponible dès maintenant auprès d'un·e membre de la Frégate!"
						: "Bientôt disponible"}
				</li>
			</ul>
		</div>
	);
};

const OtherProducts = () => {
	return <ProductList />;
};

// const Product = () => {
// 	const [dataProduct, setDataProduct] = useState(<></>);
// 	const [thumbnail, setThumbnail] = useState(null);
// 	const param = useParams();
//
// 	useEffect(() => {
// 		fetch(
// 			`http://${global.config.api.authority}/goodies/${param.id}/album`,
// 			{
// 				credentials: "include"
// 			}
// 		)
// 			.then(response => {
// 				if (!response.ok) {
// 					throw new Error(
// 						`This is an HTTP error: The status is` +
// 							` ${response.status}`
// 					);
// 				}
// 				return response.blob();
// 			})
// 			.then(blob => {
// 				setAlbum(URL.createObjectURL(blob));
// 			})
// 			.catch(function(error) {
// 				console.log(
// 					"Il y a eu un problème avec l'opération fetch: " +
// 						error.message
// 				);
// 			});
// 	}, []);
//
// 	useEffect(() => {
// 		fetch(`http://${global.config.api.authority}/goodies/${param.id}`, {
// 			credentials: "include"
// 		})
// 			.then(response => {
// 				if (!response.ok) {
// 					setDataProduct(<Navigate to="/home" />);
// 					throw new Error(
// 						`This is an HTTP error: The status is ${response.status}`
// 					);
// 				}
// 				return response.json();
// 			})
// 			.then(d => {
// 				setDataProduct(
// 					<Card
// 						style={{
// 							width: "18rem"
// 						}}
// 					>
// 						<LazyLoadImage
// 							height="auto"
// 							src={thumbnail}
// 							width="auto"
// 							effect="blur"
// 						/>
// 						<CardBody>
// 							<CardTitle tag="h5"> {d.name}</CardTitle>
// 							<CardSubtitle tag="h6">
// 								{`Prix : ${d.cost}`}
// 							</CardSubtitle>
// 							<CardText>{d.desc}</CardText>
// 						</CardBody>
// 					</Card>
// 				);
// 			})
// 			.catch(function(error) {
// 				console.log(
// 					`This is a fetch error: The error is ${error.message}`
// 				);
// 			});
// 	}, [param.id]);
//
// 	return <> {dataProduct}</>;
// };
export default Product;
