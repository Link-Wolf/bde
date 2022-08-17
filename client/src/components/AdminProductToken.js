import {useEffect, useState, useRef} from "react";
import {Accordion, Form} from "react-bootstrap";
import {Button} from "reactstrap";
import useConfirm from "./useConfirm";

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
	const [button, setButton] = useState(<></>);
	const [update, setUpdate] = useState(false);
	const img = useRef(null);
	const [srcImg, setSrcImg] = useState(null);

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

	useEffect(() => {
		let tmp = {...param.data};
		tmp.available = param.data.available;
		setFormState(tmp);
		let tmpBody = {...tmp};
		setBodyState(tmpBody);
	}, [param.data]);

	useEffect(() => {
		const saveProduct = async () => {
			if (
				await isConfirmed(
					`Desire tu modifier le goodies ${param.data.name}`
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

				fetch(
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
				setLocked(true);
				setUpdate(true);
				changeThumbnail();
			}
		};

		setUpdate(false);
		if (locked)
			setButton(
				<Button
					type="button"
					color="primary"
					defaultValue={param.index}
					onClick={switchLock}
				>
					Edit
				</Button>
			);
		else
			setButton(
				<Button
					type="button"
					color="primary"
					defaultValue={param.index}
					onClick={saveProduct}
				>
					Save
				</Button>
			);
	}, [param, update, formState, locked, bodyState]);

	useEffect(() => {
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
	}, []);

	const changeThumbnail = () => {
		const data = new FormData();
		data.append("thumbnail", img.current);
		fetch(
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
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

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
			window.location.reload();
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
					<img src={srcImg} height="150px" />
					{button}
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

// TODO:
// check si fichier OK
// delete fichier ref dans evnet
// save new fichier (en renamant clean)
// save nouvelle ref
// :)
// (debug)
