import {useEffect, useState} from "react";
import {Accordion, Button, Form} from "react-bootstrap";
import useConfirm from "./useConfirm";

const AdminEventToken = param => {
	const {isConfirmed} = useConfirm();
	const [formState, setFormState] = useState({
		name: "",
		desc: "",
		begin_date: "",
		end_date: "",
		place: "",
		nb_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: true,
		sponso: true,
		consos: true,
		isOutside: true,
		for_pool: true
	});
	const [bodyState, setBodyState] = useState({
		name: "",
		desc: "",
		begin_date: "",
		end_date: "",
		place: "",
		nb_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: true,
		sponso: true,
		consos: true,
		isOutside: true,
		for_pool: true
	});
	const [locked, setLocked] = useState(true);
	const [button, setButton] = useState(<></>);
	const [update, setUpdate] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
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
		let begin_date = new Date(Date.parse(tmp.begin_date));
		let end_date = new Date(Date.parse(tmp.end_date));
		let tmpBody = {...tmp};
		tmpBody.end_date =
			two_digiter(end_date.getFullYear()) +
			"-" +
			two_digiter(end_date.getMonth() + 1) +
			"-" +
			two_digiter(end_date.getDate()) +
			"T" +
			two_digiter(end_date.getHours()) +
			":" +
			two_digiter(end_date.getMinutes());
		tmpBody.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate()) +
			"T" +
			two_digiter(begin_date.getHours()) +
			":" +
			two_digiter(begin_date.getMinutes());
		setBodyState(tmpBody);
		setBodyState(tmpBody);
		setFormState(tmp);
	};

	const two_digiter = nb => {
		if (nb < 10) return "0" + nb;
		return nb;
	};

	useEffect(() => {
		let tmp = {...param.data};
		tmp.hasEndDate = param.data.end_date !== null;
		tmp.end_date = tmp.end_date ? tmp.end_date : null;
		let end_date = new Date(Date.parse(tmp.end_date));
		tmp.end_date =
			two_digiter(end_date.getFullYear()) +
			"-" +
			two_digiter(end_date.getMonth() + 1) +
			"-" +
			two_digiter(end_date.getDate()) +
			"T" +
			two_digiter(end_date.getHours()) +
			":" +
			two_digiter(end_date.getMinutes());
		let begin_date = new Date(Date.parse(tmp.begin_date));
		tmp.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate()) +
			"T" +
			two_digiter(begin_date.getHours()) +
			":" +
			two_digiter(begin_date.getMinutes());
		tmp.isOutside = param.data.isOutside;
		tmp.sponso = param.data.sponso;
		tmp.consos = param.data.consos;
		tmp.for_pool = param.data.for_pool;
		setFormState(tmp);
		let tmpBody = {...tmp};
		tmpBody.end_date =
			two_digiter(end_date.getFullYear()) +
			"-" +
			two_digiter(end_date.getMonth() + 1) +
			"-" +
			two_digiter(end_date.getDate()) +
			"T" +
			two_digiter(end_date.getHours()) +
			":" +
			two_digiter(end_date.getMinutes());
		tmpBody.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate()) +
			"T" +
			two_digiter(begin_date.getHours()) +
			":" +
			two_digiter(begin_date.getMinutes());
		setBodyState(tmpBody);
	}, [param.data]);

	useEffect(() => {
		const saveEvent = async () => {
			if (
				await isConfirmed(
					`Desire tu modifier l'event ${param.data.name}`
				)
			) {
				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				var raw = JSON.stringify({
					name: bodyState.name,
					cost: bodyState.cost,
					place: bodyState.place,
					premium_cost: bodyState.premium_cost,
					nb_places: bodyState.nb_places,
					desc: bodyState.desc,
					isOutside: bodyState.isOutside,
					consos: bodyState.consos,
					sponso: bodyState.sponso,
					begin_date: bodyState.begin_date,
					end_date: bodyState.hasEndDate ? bodyState.end_date : null
				});

				var requestOptions = {
					method: "PATCH",
					headers: myHeaders,
					body: raw,
					redirect: "follow",
					credentials: "include"
				};

				fetch(
					`http://${global.config.api.authority}
					/event/${param.data.id}`,
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
				if (selectedImage) {
					if (selectedImage["type"].split("/")[0] === "image") {
						myHeaders = new Headers();
						myHeaders.append("Content-Type", "application/json");

						let data = new FormData();

						data.append("file", selectedImage);

						requestOptions = {
							method: "POST",
							headers: myHeaders,
							body: data,
							credentials: "include"
						};
					}
				}
				setLocked(true);
				setUpdate(true);
			}
		};

		setUpdate(false);
		if (locked)
			setButton(
				<Button
					type="button"
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
					defaultValue={param.index}
					onClick={saveEvent}
				>
					Save
				</Button>
			);
	}, [param, update, formState, locked, bodyState]);

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/event/${param.data.id}/thumbnail`,
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
		data.append("thumbnail", document.getElementById("thumbnail").files[0]);

		fetch(
			`http://${global.config.api.authority}/event/upload_image
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

	return (
		<>
			<Accordion.Header>
				{formState.name} {formState.begin_date}
			</Accordion.Header>
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
					<Form.Label> Dates : </Form.Label>
					<Form.Control
						id="formBeginDate"
						disabled={locked}
						type="datetime-local"
						name="begin_date"
						value={formState.begin_date}
						onChange={handleFormChange}
						required
					/>
					{" - "}
					<Form.Control
						id="formEndDate"
						disabled={locked || !formState.hasEndDate}
						name="end_date"
						value={formState.end_date}
						onChange={handleFormChange}
						type="datetime-local"
					/>
					<Form.Switch
						disabled={locked}
						name="hasEndDate"
						id="hasEndDate"
						checked={formState.hasEndDate}
						onChange={handleFormChange}
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
					€ (
					<Form.Control
						disabled={locked}
						type="number"
						min="0"
						id="formPremiumCost"
						step="0.01"
						name="premium_cost"
						onChange={handleFormChange}
						value={formState.premium_cost}
					/>
					€ )<Form.Label>Places : </Form.Label>
					{" ? / "}
					<Form.Control
						disabled={locked}
						type="number"
						id="formNbPlaces"
						min="-42"
						name="nb_places"
						onChange={handleFormChange}
						value={formState.nb_places}
					/>
					<Form.Label>Lieu : </Form.Label>
					<Form.Control
						disabled={locked}
						type="text"
						id="formPlace"
						name="place"
						onChange={handleFormChange}
						value={formState.place}
						required
					/>
					<Form.Switch
						disabled={locked}
						id="formIsOutside"
						label="Outside"
						name="isOutside"
						onChange={handleFormChange}
						checked={formState.isOutside}
					/>
					<Form.Switch
						disabled={locked}
						id="formSponso"
						label="Sponsorised"
						name="sponso"
						onChange={handleFormChange}
						checked={formState.sponso}
					/>
					<Form.Switch
						disabled={locked}
						id="formConsos"
						label="Consommation"
						name="consos"
						onChange={handleFormChange}
						checked={formState.consos}
					/>
					<Form.Switch
						disabled={locked}
						id="formForPool"
						label="Pour les piscineux"
						name="for_pool"
						onChange={handleFormChange}
						checked={formState.for_pool}
					/>
					{button}
					<Button type="reset" disabled={locked}>
						Reset
					</Button>
					<Form.Control
						type="file"
						id="thumbnail"
						onChange={event => {
							setSrcImg(
								URL.createObjectURL(event.target.files[0])
							);
						}}
						disabled={locked}
					/>
					<img src={srcImg} height="150px" />
					<Button disabled={locked} onClick={changeThumbnail}>
						Changer Miniature
					</Button>
				</Form>
			</Accordion.Body>
		</>
	);
};

export default AdminEventToken;

// TODO:
// check si fichier OK
// delete fichier ref dans evnet
// save new fichier (en renamant clean)
// save nouvelle ref
// :)
// (debug)
