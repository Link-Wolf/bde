import React, {useState, useEffect, useRef} from "react";
import b64ToBlob from "b64-to-blob";
import jszip from "jszip";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from "react-responsive-carousel";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const EventAlbum = param => {
	const [update, setUpdate] = useState(false);
	const [ret, setRet] = useState(<></>);
	const [photos, setPhotos] = useState([]);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/event/${param.id}/album`, {
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
			.then(arrayBuffer => {
				jszip.loadAsync(arrayBuffer).then(({files}) => {
					const mediaFiles = Object.entries(
						files
					).filter(([fileName]) => fileName.endsWith(".jpg"));

					if (!mediaFiles.length) {
						throw new Error("No media files found in archive");
					}

					mediaFiles.forEach(([, image], i) => {
						image
							.async("blob")
							.then(blob => {
								let tmp = photos;
								tmp[i] = URL.createObjectURL(blob);
								setPhotos(tmp);
							})
							.then(() => {
								setUpdate(true);
							});
					});
				});
			});
	}, []);

	useEffect(() => {
		setUpdate(false);
		setRet(
			<Carousel>
				{photos.map((src, i) => (
					<div key={i}>
						<LazyLoadImage
							height="auto"
							src={src}
							width="auto"
							effect="blur"
						/>
					</div>
				))}
			</Carousel>
		);
	}, [update]);

	return ret;
};

export default EventAlbum;
