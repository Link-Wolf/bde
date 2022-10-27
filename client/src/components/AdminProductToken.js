import {useEffect, useState, useRef} from "react";
import {Accordion, Form} from "react-bootstrap";
import {Button} from "reactstrap";
import useConfirm from "./useConfirm";
import {LazyLoadImage} from "react-lazy-load-image-component";
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
	const [locked, setLocked] = useState(true);
	const [update, setUpdate] = useState(false);
	const [thumbnail, setThumbnail] = useState([]);
	const [album, setAlbum] = useState([]);

	const switchLock = () => {
		setLocked(false);
		setUpdate(true);
	};

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

	const changeThumbnail = async () => {
		const data = new FormData();
		data.append("thumbnail", thumbnail[0]);
		await fetch(
			`${process.env.REACT_APP_API_URL}/goodies/upload_image
			/${param.data.id}`,
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
			.then(() => {
				setUpdate(true);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

	const changeAlbum = async () => {
		const data = new FormData();
		for (let i = 0; i < album.length; i++) {
			data.append(`album`, album[i]);
		}
		await fetch(
			`${process.env.REACT_APP_API_URL}/goodies/upload_album
			/${param.data.id}`,
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
			.then(() => {
				setUpdate(true);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

	const saveProduct = async () => {
		if (
			await isConfirmed(
				`Désires tu modifier le produit ${param.data.name} ?`
			)
		) {
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
				method: "PATCH",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
				credentials: "include"
			};

			await fetch(
				`${process.env.REACT_APP_API_URL}/goodies/${param.data.id}`,
				requestOptions
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
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
			await changeThumbnail();
			await changeAlbum();
			window.location.reload();
		}
	};

	useEffect(() => {
		if (param.data === undefined || param.data === "" || !param.data)
			return;
		let tmp = {...param.data};
		tmp.available = param.data.available;
		setFormState(tmp);
		let tmpBody = {...tmp};
		setBodyState(tmpBody);
	}, [param.data]);

	useEffect(() => {
		if (param === undefined || param === "" || !param) return;
		setUpdate(false);
		fetch(
			`${process.env.REACT_APP_API_URL}/goodies/${param.data.id}/thumbnail`,
			{
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is` +
							` ${response.status}`
					);
				}
				return response.blob();
			})
			.then(blob => {
				setThumbnail([blob]);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [update, param]);

	const deleteProduct = async () => {
		if (
			await isConfirmed(
				`Désires tu supprimer le produit ${param.data.name}`
			)
		) {
			await fetch(
				`${process.env.REACT_APP_API_URL}/goodies/${param.data.id}`,
				{
					method: "DELETE",
					credentials: "include"
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
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
			param.setUpdate(true);
			setUpdate(true);
			setLocked(true);
		}
	};

	return (
		<>
			<Accordion.Header>{formState.name}</Accordion.Header>
			<Accordion.Body>
				<form className={style.form}>
					<label>Nom</label>
					<input
						disabled={locked}
						name="name"
						type="text"
						id="formName"
						autoFocus="autofocus"
						value={formState.name}
						onChange={handleFormChange}
						required
					/>
					<label>Description</label>
					<input
						name="desc"
						value={formState.desc}
						disabled={locked}
						onChange={handleFormChange}
						id="formDesc"
					/>
					<label>Prix</label>
					<input
						disabled={locked}
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
						disabled={locked}
					/>
					{thumbnail.length && (
						<img
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
						disabled={locked}
					/>
					<div>
						{locked ? (
							<button
								type="button"
								color="primary"
								defaultValue={param.index}
								onClick={switchLock}
							>
								Modifier
							</button>
						) : (
							<button
								type="button"
								color="primary"
								defaultValue={param.index}
								onClick={saveProduct}
							>
								Enregistrer
							</button>
						)}
						<button
							color="secondary"
							type="reset"
							disabled={locked}
						>
							Réinitialiser
						</button>
						<button color="danger" onClick={deleteProduct}>
							Supprimer
						</button>
					</div>
				</form>
			</Accordion.Body>
		</>
	);
};

export default AdminProductToken;
