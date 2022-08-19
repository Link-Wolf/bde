import {useRef, useState} from "react";
import {Button, Form} from "react-bootstrap";
import useConfirm from "./useConfirm";

const AdminProductToken = param => {
	const {isConfirmed} = useConfirm();

	const [formState, setFormState] = useState({
		name: "",
		desc: "",
		cost: 0,
		available: false
	});
	const [bodyState, setBodyState] = useState({
		name: "",
		desc: "",
		cost: 0,
		available: false
	});
	const img = useRef(null);
	const [srcImg, setSrcImg] = useState(null);

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
			`Desire tu creer ce nouveau produit ?`
		);
		if (confirm) {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			var raw = JSON.stringify({
				name: bodyState.name,
				cost: bodyState.cost,
				desc: bodyState.desc,
				available: bodyState.available
			});

			var requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
				credentials: "include"
			};

			fetch(
				`http://${global.config.api.authority}/goodies/`,
				requestOptions
			)
				.then(response => {
					if (!response.ok) {
						throw new Error(
							`This is an HTTP error: The status is ${response.status}`
						);
					}
					return response.json();
				})
				.then(data => {
					changeThumbnail(data.id).then(() => {
						param.setUpdate(true);
					});
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
		}
	};

	const changeThumbnail = async id => {
		const data = new FormData();
		data.append("thumbnail", img.current);
		await fetch(
			`http://${global.config.api.authority}/goodies/upload_image/${id}`,
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

	return (
		<>
			<Form>
				<Form.Label>Name : </Form.Label>
				<Form.Control
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
					onChange={handleFormChange}
					id="formDesc"
				/>
				<Form.Label>Prix : </Form.Label>
				<Form.Control
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
					id="formAvailable"
					label="Est il dispo"
					name="available"
					onChange={handleFormChange}
					value={formState.available}
				/>
				<Form.Control
					type="file"
					id="thumbnail"
					onChange={event => {
						console.log("file :", event.target.files[0]);
						img.current = event.target.files[0];
						setSrcImg(URL.createObjectURL(event.target.files[0]));
					}}
				/>
				<img src={srcImg} height="150px" />
				<Button type="button" defaultValue={-1} onClick={saveProduct}>
					Save
				</Button>
				<Button type="button" defaultValue={-1} onClick={param.cancel}>
					Cancel
				</Button>
			</Form>
		</>
	);
};

export default AdminProductToken;
