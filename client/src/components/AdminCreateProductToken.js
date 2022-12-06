import {useRef, useState} from "react";
import {Button, Form} from "react-bootstrap";
import useConfirm from "./useConfirm";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {NotificationManager} from "react-notifications";
import "react-lazy-load-image-component/src/effects/blur.css";
import style from "../style/AdminProductToken.module.scss";

const AdminProductToken = param => {
	const {isConfirmed} = useConfirm();

	const [formState, setFormState] = useState({
		name: "",
		desc: "",
		cost: 0,
		stock: 0,
		s: 0,
		m: 0,
		l: 0,
		xl: 0
	});
	const [bodyState, setBodyState] = useState({
		name: "",
		desc: "",
		cost: 0,
		stock: 0,
		s: 0,
		m: 0,
		l: 0,
		xl: 0
	});
	const [thumbnail, setThumbnail] = useState([]);
	const [album, setAlbum] = useState([]);

	const handleFormChange = event => {
		let tmp = {...formState};
		const target = event.target;
		const value =
			target.type === "checkbox" || target.type === "switch"
				? target.checked
				: target.value;
		const name = target.name;
		tmp[name] = value;
		let tmpBody = {...tmp};
		setBodyState(tmpBody);
		setFormState(tmp);
	};

	const saveProduct = async () => {
		const confirm = await isConfirmed(
			`Désires tu créer ce nouveau produit ?`
		);
		if (confirm) {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			var raw = JSON.stringify({
				name: bodyState.name,
				cost: bodyState.cost,
				desc: bodyState.desc,
				stock: bodyState.stock,
				s: bodyState.s,
				m: bodyState.m,
				l: bodyState.l,
				xl: bodyState.xl
			});

			var requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
				credentials: "include"
			};

			await fetch(
				`${process.env.REACT_APP_API_URL}/goodies`,
				requestOptions
			)
				.then(response => {
					if (!response.ok) {
						throw new Error(
							`This is an HTTP error:
							 The status is ${response.status}`
						);
					}
					return response.json();
				})
				.then(async data => {
					await changeThumbnail(data.id);
					await changeAlbum(data.id);
				})
				.catch(function(error) {
					NotificationManager.error(
						"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
						"Erreur",
						5000
					);
				});

			window.location.reload();
		}
	};

	const changeThumbnail = async id => {
		const data = new FormData();
		data.append("thumbnail", thumbnail[0]);
		await fetch(
			`${process.env.REACT_APP_API_URL}/goodies/upload_image
			/${id}`,
			{
				method: "POST",
				credentials: "include",
				body: data
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error:
					 The status is ${response.status}`
					);
				}
			})

			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	const changeAlbum = async id => {
		const data = new FormData();
		for (let i = 0; i < album.length; i++) {
			data.append(`album`, album[i]);
		}
		await fetch(
			`${process.env.REACT_APP_API_URL}/goodies/upload_album
			/${id}`,
			{
				method: "POST",
				credentials: "include",
				body: data
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error:
					 The status is ${response.status}`
					);
				}
			})

			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	return (
		<form className={style.form}>
			<label>Nom</label>
			<input
				name="name"
				type="text"
				id="formName"
				autoFocus="autofocus"
				value={formState.name}
				onChange={handleFormChange}
				required
			/>
			<label>Description</label>
			<textarea
				name="desc"
				value={formState.desc}
				onChange={handleFormChange}
				id="formDesc"
			/>
			<label>Prix</label>
			<input
				type="number"
				min="0"
				step="0.01"
				id="formCost"
				value={formState.cost}
				name="cost"
				onChange={handleFormChange}
				required
			/>
			<label>Image de couverture</label>
			<input
				type="file"
				id="thumbnail"
				accept="img/png, img/jpeg"
				files={thumbnail}
				onChange={event => {
					setThumbnail(event.target.files);
				}}
			/>
			{thumbnail.length && (
				<img alt=""
					height="150px"
					src={URL.createObjectURL(thumbnail[0])}
					width="auto"
				/>
			)}
			<label>Album photos</label>
			<input
				type="file"
				id="album"
				multiple
				accept="img/png, img/jpeg"
				files={album}
				onChange={event => {
					setAlbum(event.target.files);
				}}
			/>
			<div>
				<button type="button" defaultValue={-1} onClick={saveProduct}>
					Enregistrer
				</button>
				<button type="button" defaultValue={-1} onClick={param.cancel}>
					Annuler
				</button>
			</div>
		</form>
	);
};

export default AdminProductToken;
