import {useState, useRef} from "react";
import {Button, Form} from "react-bootstrap";
import useConfirm from "./useConfirm";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const parseDate = date => {
	return (
		two_digiter(date.getFullYear()) +
		"-" +
		two_digiter(date.getMonth() + 1) +
		"-" +
		two_digiter(date.getDate()) +
		"T" +
		two_digiter(date.getHours()) +
		":" +
		two_digiter(date.getMinutes())
	);
};

const two_digiter = nb => {
	if (nb < 10) return "0" + nb;
	return nb;
};

const AdminCreateEventToken = param => {
	const {isConfirmed} = useConfirm();
	const [formState, setFormState] = useState({
		name: "",
		desc: "",
		begin_date: parseDate(new Date(Date.now())),
		end_date: parseDate(new Date(Date.now())),
		available_date: parseDate(new Date(Date.now())),
		place: "",
		nb_places: 0,
		nb_premium_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: false,
		sponso: false,
		consos: false,
		isOutside: false,
		for_pool: false
	});
	const [bodyState, setBodyState] = useState({
		name: "",
		desc: "",
		begin_date: parseDate(new Date(Date.now())),
		end_date: parseDate(new Date(Date.now())),
		available_date: parseDate(new Date(Date.now())),
		place: "",
		nb_places: 0,
		nb_premium_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: false,
		sponso: false,
		consos: false,
		isOutside: false,
		for_pool: false
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
		// console.log(tmp);

		// let begin_date = new Date(Date.parse(tmp.begin_date));
		// let end_date = new Date(Date.parse(tmp.end_date));
		// let available_date = new Date(Date.parse(tmp.available_date));
		// let tmpBody = {...tmp};
		// console.log(tmp.begin_date);
		// tmpBody.end_date =
		// 	two_digiter(end_date.getFullYear()) +
		// 	"-" +
		// 	two_digiter(end_date.getMonth() + 1) +
		// 	"-" +
		// 	two_digiter(end_date.getDate()) +
		// 	"T" +
		// 	two_digiter(end_date.getHours()) +
		// 	":" +
		// 	two_digiter(end_date.getMinutes());
		// tmpBody.begin_date =
		// 	two_digiter(begin_date.getFullYear()) +
		// 	"-" +
		// 	two_digiter(begin_date.getMonth() + 1) +
		// 	"-" +
		// 	two_digiter(begin_date.getDate()) +
		// 	"T" +
		// 	two_digiter(begin_date.getHours()) +
		// 	":" +
		// 	two_digiter(begin_date.getMinutes());
		// tmpBody.available_date =
		// 	two_digiter(available_date.getFullYear()) +
		// 	"-" +
		// 	two_digiter(available_date.getMonth() + 1) +
		// 	"-" +
		// 	two_digiter(available_date.getDate()) +
		// 	"T" +
		// 	two_digiter(available_date.getHours()) +
		// 	":" +
		// 	two_digiter(available_date.getMinutes());
		setBodyState(tmp);
		setFormState(tmp);
	};

	const saveEvent = async () => {
		if (!document.getElementById("createEventForm").checkValidity()) return;
		const confirm = await isConfirmed(`Désires tu créer cet évènement ?`);
		if (confirm) {
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
				available_date: bodyState.available_date,
				end_date: bodyState.hasEndDate ? bodyState.end_date : null,
				for_pool: bodyState.for_pool
			});

			var requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
				credentials: "include"
			};

			fetch(
				`${process.env.REACT_APP_API_URL}/event/`,
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
						window.location.reload();
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
			`${process.env.REACT_APP_API_URL}/event/upload_image/${id}`,
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
			<Form id="createEventForm">
				<Form.Label>Nom : </Form.Label>
				<Form.Control
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
					name="begin_date"
					max={formState.hasEndDate ? formState.end_date : Infinity}
					value={formState.begin_date}
					onChange={handleFormChange}
					type="datetime-local"
					required
				/>
				{" - "}
				<Form.Control
					id="formEndDate"
					name="end_date"
					min={formState.begin_date}
					disabled={!formState.hasEndDate}
					value={formState.end_date}
					onChange={handleFormChange}
					type="datetime-local"
				/>
				<Form.Switch
					name="hasEndDate"
					id="hasEndDate"
					checked={formState.hasEndDate}
					onChange={handleFormChange}
				/>
				<Form.Label>Date de disponibilité : </Form.Label>
				<Form.Control
					id="formEndDate"
					name="available_date"
					value={formState.available_date}
					onChange={handleFormChange}
					type="datetime-local"
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
					step="1"
					id="formCost"
					value={formState.cost}
					name="cost"
					onChange={handleFormChange}
					required
				/>{" "}
				€ (
				<Form.Control
					type="number"
					min="0"
					id="formPremiumCost"
					step="1"
					name="premium_cost"
					onChange={handleFormChange}
					value={formState.premium_cost}
				/>
				€ )<Form.Label>Nombre de places : </Form.Label>
				{" ? / "}
				<Form.Control
					type="number"
					id="formNbPlaces"
					min="-42"
					name="nb_places"
					onChange={handleFormChange}
					value={formState.nb_places}
				/>
				<Form.Label>
					Nombre de places réservées aux cotisés :{" "}
				</Form.Label>
				{" ? / "}
				<Form.Control
					type="number"
					id="formNbPremiumPlaces"
					min="0"
					name="nb_premium_places"
					onChange={handleFormChange}
					value={formState.nb_premium_places}
				/>
				<Form.Label>Lieu : </Form.Label>
				<Form.Control
					type="text"
					id="formPlace"
					name="place"
					onChange={handleFormChange}
					value={formState.place}
					required
				/>
				<Form.Switch
					id="formIsOutside"
					label="À l'extérieur de 42"
					name="isOutside"
					onChange={handleFormChange}
					value={formState.isOutside}
				/>
				<Form.Switch
					id="formSponso"
					label="Sponsorisé"
					name="sponso"
					onChange={handleFormChange}
					value={formState.sponso}
				/>
				<Form.Switch
					id="formConsos"
					label="Consommations"
					name="consos"
					onChange={handleFormChange}
					value={formState.consos}
				/>
				<Form.Switch
					id="formForPool"
					label="Ouvert aux piscineux"
					name="for_pool"
					onChange={handleFormChange}
					value={formState.for_pool}
				/>
				<Form.Control
					type="file"
					id="thumbnail"
					onChange={event => {
						img.current = event.target.files[0];
						setSrcImg(URL.createObjectURL(event.target.files[0]));
					}}
				/>
				<LazyLoadImage
					height="150px"
					src={srcImg}
					width="auto"
					effect="blur"
				/>
				<Button type="button" defaultValue={-1} onClick={saveEvent}>
					Enregistrer
				</Button>
				<Button type="button" defaultValue={-1} onClick={param.cancel}>
					Annuler
				</Button>
			</Form>
		</>
	);
};

export default AdminCreateEventToken;
