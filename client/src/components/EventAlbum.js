import React, {useState, useEffect, useRef} from "react";
import b64ToBlob from "b64-to-blob";
import jszip from "jszip";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from "react-responsive-carousel";
const EventAlbum = param => {
	const [album, setAlbum] = useState([]);
	const photos = useRef([]);

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
					let jpgs = [];
					const mediaFiles = Object.entries(
						files
					).filter(([fileName]) => fileName.endsWith(".jpg"));

					if (!mediaFiles.length) {
						throw new Error("No media files found in archive");
					}

					setAlbum(mediaFiles);
				});
			});
	}, []);

	useEffect(() => {
		album.forEach(([, image], i) => {
			image.async("blob").then(blob => {
				photos.current[i] = URL.createObjectURL(blob);
			});
		});
	}, [album]);

	return (
		<Carousel>
			{photos.current.map((src, i) => (
				<div key={i}>
					<img src={src} />
				</div>
			))}
		</Carousel>
	);
};

export default EventAlbum;
