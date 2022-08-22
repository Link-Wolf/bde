import React, {useState} from "react";
import b64ToBlob from "b64-to-blob";
import fileSaver from "file-saver";
import jszip from "jszip";

const DLButton = param => {
	const [downloading, setDownloading] = useState(false);

	const handleDownloadZip = () => {
		setDownloading(true);

		fetch(`http://${global.config.api.authority}/event/${param.id}/album`, {
			credentials: "include"
		})
			.then(response => {
				return response.json();
			})
			.then(arrayBuffer => {
				jszip.loadAsync(arrayBuffer).then(({files}) => {
					const jpgs = [];
					const mediaFiles = Object.entries(
						files
					).filter(([fileName]) => fileName.endsWith(".jpg"));

					if (!mediaFiles.length) {
						throw new Error("No media files found in archive");
					}

					mediaFiles.forEach(([, image]) => {
						image.async("blob").then(blob => {
							const img = new Image();
							img.src = URL.createObjectURL(blob);
							document.body.prepend(img);
						});
					});

					return jpgs;
				});
			});
	};

	return (
		<div>
			<h4 className="mb-5">Zip Downloader</h4>
			<button
				className="btn btn-primary"
				disabled={downloading}
				onClick={handleDownloadZip}
			>
				{downloading ? "Downloading..." : "Download Zip"}
			</button>
		</div>
	);
};

export default DLButton;
