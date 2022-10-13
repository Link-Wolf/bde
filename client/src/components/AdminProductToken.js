import {useEffect, useState, useRef} from "react";
import {Accordion, Form} from "react-bootstrap";
import {Button} from "reactstrap";
import useConfirm from "./useConfirm";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const AdminProductToken = param => {
	const {isConfirmed} = useConfirm();
	const [formState, setFormState] = useState({
		name: "",
		desc: "",
		cost: 0,
		available: true
	});
	const [bodyState, setBodyState] = useState({
		name: "",
		desc: "",
		cost: 0,
		available: true
	});
	const [locked, setLocked] = useState(true);
	const [update, setUpdate] = useState(false);
	const [srcImg, setSrcImg] = useState(null);
	const img = useRef(null);

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
		data.append("thumbnail", img.current);
		await fetch(
			`http://${global.config.api.authority}/goodies/upload_image
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
				`Desire tu modifier le goodies ${param.data.name} ?`
			)
		) {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			var raw = JSON.stringify({
				name: bodyState.name,
				cost: bodyState.cost,
				desc: bodyState.desc,
				available: bodyState.available
			});

			var requestOptions = {
				method: "PATCH",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
				credentials: "include"
			};

			await fetch(
				`http://${global.config.api.authority}/goodies/${param.data.id}`,
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
			`http://${global.config.api.authority}/goodies/${param.data.id}/thumbnail`,
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
				setSrcImg(URL.createObjectURL(blob));
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [update, param]);

	const deleteProduct = async () => {
		if (true) {
			await fetch(
				`http://${global.config.api.authority}/goodies/${param.data.id}`,
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
				{" "}
				<Form>
					<Form.Label>Name : </Form.Label>
					<Form.Control
						disabled={locked}
						name="name"
						type="text"
						id="formName"
						autoFocus="autofocus"
						value={formState.name}
						onChange={handleFormChange}
						required
					/>
					<Form.Label>Description : </Form.Label>
					<Form.Control
						name="desc"
						value={formState.desc}
						disabled={locked}
						onChange={handleFormChange}
						id="formDesc"
					/>
					<Form.Label>Prix : </Form.Label>
					<Form.Control
						disabled={locked}
						type="number"
						min="0"
						step="0.01"
						id="formCost"
						value={formState.cost}
						name="cost"
						onChange={handleFormChange}
						required
					/>{" "}
					€
					<Form.Switch
						disabled={locked}
						id="formAvailable"
						label="Est dispo"
						name="available"
						onChange={handleFormChange}
						checked={formState.available}
					/>
					<Form.Control
						type="file"
						id="thumbnail"
						onChange={event => {
							console.log("file :", event.target.files[0]);
							img.current = event.target.files[0];
							setSrcImg(
								URL.createObjectURL(event.target.files[0])
							);
						}}
						disabled={locked}
					/>
					<LazyLoadImage
						height="150px"
						src={srcImg}
						width="auto"
						effect="blur"
					/>
					{locked ? (
						<Button
							type="button"
							color="primary"
							defaultValue={param.index}
							onClick={switchLock}
						>
							Edit
						</Button>
					) : (
						<Button
							type="button"
							color="primary"
							defaultValue={param.index}
							onClick={saveProduct}
						>
							Save
						</Button>
					)}
					<Button color="secondary" type="reset" disabled={locked}>
						Reset
					</Button>
					<Button color="danger" onClick={deleteProduct}>
						Delete
					</Button>
				</Form>
			</Accordion.Body>
		</>
	);
};

export default AdminProductToken;
