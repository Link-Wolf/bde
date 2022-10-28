import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import getLabel from "react-select-country-list";
import style from "../../style/Purchase.module.scss";

const PurchaseButtons = props => {
	const currency = "EUR";
	const style = {layout: "vertical"};
	const [{options}, dispatch] = usePayPalScriptReducer();

	useEffect(() => {
		dispatch({
			type: "resetOptions",
			value: {
				...options,
				currency: currency
			}
		});
	}, [currency]);

	return (
		<PayPalButtons
			style={style}
			disabled={false}
			forceReRender={[props.amount, currency, style]}
			fundingSource={undefined}
			createOrder={(data, actions) => {
				return actions.order
					.create({
						purchase_units: [
							{
								amount: {
									currency_code: currency,
									value: props.amount
								}
							}
						]
					})
					.then(orderId => {
						const body = JSON.stringify({
							id: orderId,
							type: props.event ? props.event.id : -1,
							studLogin: props.session.login,
							cost: props.amount,
							source: data.paymentSource,
							address: `${props.address.address_line_1} ${props.address.address_line_2}`,
							city: `${props.address.postal_code} ${
								props.address.city
							}, ${
								getLabel(props.address.country_code).valueMap[
									props.address.country_code.toLowerCase()
								]
							}`
						});
						fetch(`${process.env.REACT_APP_API_URL}/order/create`, {
							method: "POST",
							credentials: "include",
							body: body,
							headers: {
								"Content-Type": "application/json"
							}
						});
						return orderId;
					});
			}}
			onApprove={function(data, actions) {
				return actions.order.capture().then(function() {
					const body = JSON.stringify({
						id: data.orderID
					});
					fetch(`${process.env.REACT_APP_API_URL}/order/capture`, {
						method: "POST",
						credentials: "include",
						body: body,
						headers: {
							"Content-Type": "application/json"
						}
					})
						.then(response => {
							if (!response.ok) {
								throw new Error(
									`This is an HTTP error: The status is ${response.status}`
								);
							}
							return response.json();
						})
						.then(async () => {
							if (props.needMail)
								await fetch(
									`${process.env.REACT_APP_API_URL}/stud/${props.session.login}`,
									{
										credentials: "include",
										method: "PATCH",
										body: JSON.stringify({
											true_email: props.address.mail
										}),
										headers: {
											"Content-Type": "application/json"
										}
									}
								)
									.then(response => {
										if (!response.ok) {
											throw new Error(
												`This is an HTTP error: The status is ${response.status}`
											);
										}
										props.setNeedMail(false);
									})
									.catch(function(error) {
										console.log(
											"Il y a eu un problème avec l'opération fetch: " +
												error.message
										);
									});
						})
						.then(() => {
							window.location = `/receipt/${data.orderID}`;
						});
				});
			}}
			onError={err => {
				NotificationManager.error(
					"Une erreur s'est produite.",
					"Erreur",
					5000
				); //TODO: text here
			}}
			onCancel={() => {
				window.location = "/home";
			}}
		/>
	);
};

const LegalNote = () => {
	return (
		<p>
			En validant la commande et en procédant au paiement, je reconnais
			avoir pris connaissance et accepté les{" "}
			<a href="/dollarthings" target="_blank" rel="noopener noreferrer">
				conditions générales de vente{" "}
			</a>{" "}
			ci-annexées du site du BDE 42 Mulhouse.
		</p>
	);
};

const CommandRecap = props => {
	return (
		<table>
			<thead>
				<tr>
					<th colSpan={3}>Résumé de la commande</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td colSpan={2}>
						{props.time
							? `Cotisation de ${props.time} mois`
							: `Inscription à l'évènement ${props.name}`}
					</td>
					<td>{props.amount}€</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<th colSpan={2}>Total</th>
					<th>{props.amount}€</th>
				</tr>
			</tfoot>
		</table>
	);
};

const PrePurchase = () => {
	const [data, setData] = useState();
	const param = useParams();
	useEffect(() => {
		if (param.event === undefined) return;
		fetch(`${process.env.REACT_APP_API_URL}/event/${param.event}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(json => {
				setData(json);
			})
			.catch(err => {
				window.location = "/home";
			});
	}, [param]);
	if (data === undefined) return;
	return <Purchase event={data} />;
};

const Purchase = props => {
	const [isSubbed, setIsSubbed] = useState(undefined);
	const [needMail, setNeedMail] = useState(false);
	const [contributionStatus, setContributionStatus] = useState(undefined);
	const [optionsProvider, setOptionsProvider] = useState({
		"client-id": process.env.REACT_APP_PAYPAL_ID,
		currency: "EUR",
		intent: "capture"
	});
	const [time, setTime] = useState();
	const [amount, setAmount] = useState();
	const [session, setSession] = useState({});
	const [validated, setValidated] = useState(false);
	const [addressFormState, setAddressFormState] = useState({
		postal_code: "",
		address_line_1: "",
		address_line_2: "",
		city: "",
		country_code: "FR",
		firstname: "firstname",
		lastname: "lastname",
		mail: ""
	});
	const [fixedAddress, setFixedAddress] = useState();

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/session`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(json => {
				const tmp = addressFormState;
				tmp.firstname = json.firstname;
				tmp.lastname = json.lastname;
				setAddressFormState(tmp);
				setSession(json);
				if (json.clearance !== 0) checkTrueMail(json.login);
			});
	}, []);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/paypal/clientToken`, {
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
			.then(text => {
				let tmp = optionsProvider;
				tmp["data-client-token"] = text;
				setOptionsProvider(tmp);
			});
	}, []);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/contribution/info`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(json => {
				setAmount(json.price);
				setTime(json.time);
			});
	}, []);

	useEffect(() => {
		if (session === undefined || isSubbed === undefined) return;
		fetch(
			`${process.env.REACT_APP_API_URL}/contribution/${session.login}`,
			{
				credentials: "include"
			}
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
				let tmp = false;
				data.forEach((item, i) => {
					if (
						new Date(item.end_date) > Date.now() &&
						new Date(item.begin_date) <= Date.now()
					) {
						tmp = true;
					}
				});
				setContributionStatus(tmp);
				if (
					((props.event === undefined && tmp) || !props.event.for_pool &&
						session.clearance < global.config.clearance.stud) ||
					props.event.cost <= 0 ||
					(props.event.premium_cost <= 0 && tmp) ||
					session.clearance <
						global.config.clearance
							.pool || isSubbed
				)
					window.location = "/home";
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [session, isSubbed]);

	useEffect(() => {
		if (
			props.event === undefined
		)
			{
				setIsSubbed(false);
				return;
			}
		fetch(
			`${process.env.REACT_APP_API_URL}/inscription/${props.event.id}/isSubbed`,
			{
				credentials: "include"
			}
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
				setIsSubbed(data.isSubbed);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [props]);

	const checkTrueMail = async login => {
		fetch(`${process.env.REACT_APP_API_URL}/stud/${login}/mail`, {
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
			.then(data => {
				let tmp = addressFormState;
				if (!data || data == "" || data == undefined) {
					setNeedMail(true);
					tmp.mail = "";
				} else {
					tmp.mail = data;
				}
				setAddressFormState(tmp);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

	if (!props.event && contributionStatus === undefined) return "Loading";

	if (!props.event && contributionStatus === true) {
		window.location = "/home";
		return <></>;
	}

	return (
		<div className={style.purchase}>
			<div className={style.left}>
				<div className={style.intro}>
					<p>
						Dans le cas ou vous ne souhaiteriez ou ne pourriez pas
						procéder à un paiement en ligne sur le site, toute
						transaction peut se faire en physique par carte bancaire
						(contact ou sans contact) ou espèces en contactant un
						membre du BDE.
					</p>
					{/*TODO: text*/}
					<hr />
				</div>
				<div className={style.payment}>
					<AddressForm
						setState={setAddressFormState}
						state={addressFormState}
						validated={validated}
						needMail={needMail}
					/>
					<button id={style.undo}
						onClick={() => {
							window.history.back();
						}}
					>
						Annuler
					</button>
					<button id={style.validate}
						disabled={validated}
						onClick={() => {
							if (
								addressFormState.postal_code !== "" &&
								addressFormState.address_line_1 !== "" &&
								addressFormState.city !== "" &&
								!(
									document
										.getElementById("emailField")
										.checkValidity() &&
									addressFormState.mail
										.split("@")[1]
										.split(".")[1]
										.startsWith("42")
								)
							) {
								setValidated(true);
								setFixedAddress(addressFormState);
							}
						}}
					>
						Valider
					</button>


					{validated && (
						<div hidden={!validated} className={style.paypal}>
							<PayPalScriptProvider options={optionsProvider}>
								<PurchaseButtons
									amount={
										props.event ? props.event.cost : amount
									}
									session={session}
									address={fixedAddress}
									setNeedMail={setNeedMail}
									needMail={needMail}
									type={props.event ? props.event : "contrib"}
									event={props.event}
								/>
							</PayPalScriptProvider>
						</div>
					)}
				</div>
			</div>
			<div className={style.recap}>
				<CommandRecap
					amount={props.event ? props.event.cost : amount}
					time={props.event ? "" : time}
					name={props.event ? props.event.name : ""}
				/>
				<LegalNote />
			</div>
		</div>
	);
};

const AddressForm = props => {
	const handleChange = event => {
		let tmp = {...props.state};
		const target = event.target;
		const value =
			target.type === "checkbox" || target.type === "switch"
				? target.checked
				: target.value;
		const name = target.name;
		tmp[name] = value;
		props.setState(tmp);
	};

	return (
		<form>
			<div className={` ${style.formMargin} ${style.formLine}  `}>
				<div>
					<label htmlFor="firstName">Prenom</label>
					<input
						id="firstName"
						placeholder="Prénom"
						name="firstname"
						value={props.state.firstname}
						onChange={handleChange}
						disabled
					/>
				</div>
				<div>
					<label htmlFor="lastName">Nom</label>
					<input
						id="lastName"
						placeholder="Nom de famille"
						name="lastname"
						value={props.state.lastname}
						onChange={handleChange}
						disabled
					/>
				</div>
			</div>{" "}
			<div className={style.formMargin} id={style.address}>
				<label htmlFor="address">Adresse</label>
				<div className={style.formLine}>
					<div>
						<input
							id="address"
							placeholder="30 Rue François Spoerry"
							name="address_line_1"
							value={props.state.address_line_1}
							onChange={handleChange}
							disabled={props.validated}
							required
						/>
					</div>
					<div>
						<input
							id="address2"
							placeholder="Bocal"
							name="address_line_2"
							value={props.state.address_line_2}
							onChange={handleChange}
							disabled={props.validated}
						/>
					</div>
				</div>
				<div className={style.formLine}>
					<div>
						<input
							id="city"
							placeholder="Mulhouse"
							name="city"
							value={props.state.city}
							onChange={handleChange}
							disabled={props.validated}
							required
						/>
					</div>
					<div>
						<input
							id="postal"
							placeholder="68100"
							name="postal_code"
							value={props.state.postal_code}
							onChange={handleChange}
							disabled={props.validated}
							required
						/>
					</div>
				</div>
			</div>
			<div className={`${style.country} ${style.formMargin}`}>
				<label htmlFor="country">Pays</label>
				<select
					id="country"
					name="country_code"
					value={props.state.country_code}
					onChange={handleChange}
					disabled={props.validated}
				>
					<option value="AF">Afghanistan</option>
					<option value="AX">Aland Islands</option>
					<option value="AL">Albania</option>
					<option value="DZ">Algeria</option>
					<option value="AS">American Samoa</option>
					<option value="AD">Andorra</option>
					<option value="AO">Angola</option>
					<option value="AI">Anguilla</option>
					<option value="AQ">Antarctica</option>
					<option value="AG">Antigua and Barbuda</option>
					<option value="AR">Argentina</option>
					<option value="AM">Armenia</option>
					<option value="AW">Aruba</option>
					<option value="AU">Australia</option>
					<option value="AT">Austria</option>
					<option value="AZ">Azerbaijan</option>
					<option value="BS">Bahamas</option>
					<option value="BH">Bahrain</option>
					<option value="BD">Bangladesh</option>
					<option value="BB">Barbados</option>
					<option value="BY">Belarus</option>
					<option value="BE">Belgium</option>
					<option value="BZ">Belize</option>
					<option value="BJ">Benin</option>
					<option value="BM">Bermuda</option>
					<option value="BT">Bhutan</option>
					<option value="BO">Bolivia</option>
					<option value="BQ">Bonaire, Sint Eustatius and Saba</option>
					<option value="BA">Bosnia and Herzegovina</option>
					<option value="BW">Botswana</option>
					<option value="BV">Bouvet Island</option>
					<option value="BR">Brazil</option>
					<option value="IO">British Indian Ocean Territory</option>
					<option value="BN">Brunei Darussalam</option>
					<option value="BG">Bulgaria</option>
					<option value="BF">Burkina Faso</option>
					<option value="BI">Burundi</option>
					<option value="KH">Cambodia</option>
					<option value="CM">Cameroon</option>
					<option value="CA">Canada</option>
					<option value="CV">Cape Verde</option>
					<option value="KY">Cayman Islands</option>
					<option value="CF">Central African Republic</option>
					<option value="TD">Chad</option>
					<option value="CL">Chile</option>
					<option value="CN">China</option>
					<option value="CX">Christmas Island</option>
					<option value="CC">Cocos (Keeling) Islands</option>
					<option value="CO">Colombia</option>
					<option value="KM">Comoros</option>
					<option value="CG">Congo</option>
					<option value="CD">
						Congo, Democratic Republic of the Congo
					</option>
					<option value="CK">Cook Islands</option>
					<option value="CR">Costa Rica</option>
					<option value="CI">Cote D'Ivoire</option>
					<option value="HR">Croatia</option>
					<option value="CU">Cuba</option>
					<option value="CW">Curacao</option>
					<option value="CY">Cyprus</option>
					<option value="CZ">Czech Republic</option>
					<option value="DK">Denmark</option>
					<option value="DJ">Djibouti</option>
					<option value="DM">Dominica</option>
					<option value="DO">Dominican Republic</option>
					<option value="EC">Ecuador</option>
					<option value="EG">Egypt</option>
					<option value="SV">El Salvador</option>
					<option value="GQ">Equatorial Guinea</option>
					<option value="ER">Eritrea</option>
					<option value="EE">Estonia</option>
					<option value="ET">Ethiopia</option>
					<option value="FK">Falkland Islands (Malvinas)</option>
					<option value="FO">Faroe Islands</option>
					<option value="FJ">Fiji</option>
					<option value="FI">Finland</option>
					<option value="FR">France</option>
					<option value="GF">French Guiana</option>
					<option value="PF">French Polynesia</option>
					<option value="TF">French Southern Territories</option>
					<option value="GA">Gabon</option>
					<option value="GM">Gambia</option>
					<option value="GE">Georgia</option>
					<option value="DE">Germany</option>
					<option value="GH">Ghana</option>
					<option value="GI">Gibraltar</option>
					<option value="GR">Greece</option>
					<option value="GL">Greenland</option>
					<option value="GD">Grenada</option>
					<option value="GP">Guadeloupe</option>
					<option value="GU">Guam</option>
					<option value="GT">Guatemala</option>
					<option value="GG">Guernsey</option>
					<option value="GN">Guinea</option>
					<option value="GW">Guinea-Bissau</option>
					<option value="GY">Guyana</option>
					<option value="HT">Haiti</option>
					<option value="HM">
						Heard Island and Mcdonald Islands
					</option>
					<option value="VA">Holy See (Vatican City State)</option>
					<option value="HN">Honduras</option>
					<option value="HK">Hong Kong</option>
					<option value="HU">Hungary</option>
					<option value="IS">Iceland</option>
					<option value="IN">India</option>
					<option value="ID">Indonesia</option>
					<option value="IR">Iran, Islamic Republic of</option>
					<option value="IQ">Iraq</option>
					<option value="IE">Ireland</option>
					<option value="IM">Isle of Man</option>
					<option value="IL">Israel</option>
					<option value="IT">Italy</option>
					<option value="JM">Jamaica</option>
					<option value="JP">Japan</option>
					<option value="JE">Jersey</option>
					<option value="JO">Jordan</option>
					<option value="KZ">Kazakhstan</option>
					<option value="KE">Kenya</option>
					<option value="KI">Kiribati</option>
					<option value="KP">
						Korea, Democratic People's Republic of
					</option>
					<option value="KR">Korea, Republic of</option>
					<option value="XK">Kosovo</option>
					<option value="KW">Kuwait</option>
					<option value="KG">Kyrgyzstan</option>
					<option value="LA">Lao People's Democratic Republic</option>
					<option value="LV">Latvia</option>
					<option value="LB">Lebanon</option>
					<option value="LS">Lesotho</option>
					<option value="LR">Liberia</option>
					<option value="LY">Libyan Arab Jamahiriya</option>
					<option value="LI">Liechtenstein</option>
					<option value="LT">Lithuania</option>
					<option value="LU">Luxembourg</option>
					<option value="MO">Macao</option>
					<option value="MK">
						Macedonia, the Former Yugoslav Republic of
					</option>
					<option value="MG">Madagascar</option>
					<option value="MW">Malawi</option>
					<option value="MY">Malaysia</option>
					<option value="MV">Maldives</option>
					<option value="ML">Mali</option>
					<option value="MT">Malta</option>
					<option value="MH">Marshall Islands</option>
					<option value="MQ">Martinique</option>
					<option value="MR">Mauritania</option>
					<option value="MU">Mauritius</option>
					<option value="YT">Mayotte</option>
					<option value="MX">Mexico</option>
					<option value="FM">Micronesia, Federated States of</option>
					<option value="MD">Moldova, Republic of</option>
					<option value="MC">Monaco</option>
					<option value="MN">Mongolia</option>
					<option value="ME">Montenegro</option>
					<option value="MS">Montserrat</option>
					<option value="MA">Morocco</option>
					<option value="MZ">Mozambique</option>
					<option value="MM">Myanmar</option>
					<option value="NA">Namibia</option>
					<option value="NR">Nauru</option>
					<option value="NP">Nepal</option>
					<option value="NL">Netherlands</option>
					<option value="AN">Netherlands Antilles</option>
					<option value="NC">New Caledonia</option>
					<option value="NZ">New Zealand</option>
					<option value="NI">Nicaragua</option>
					<option value="NE">Niger</option>
					<option value="NG">Nigeria</option>
					<option value="NU">Niue</option>
					<option value="NF">Norfolk Island</option>
					<option value="MP">Northern Mariana Islands</option>
					<option value="NO">Norway</option>
					<option value="OM">Oman</option>
					<option value="PK">Pakistan</option>
					<option value="PW">Palau</option>
					<option value="PS">Palestinian Territory, Occupied</option>
					<option value="PA">Panama</option>
					<option value="PG">Papua New Guinea</option>
					<option value="PY">Paraguay</option>
					<option value="PE">Peru</option>
					<option value="PH">Philippines</option>
					<option value="PN">Pitcairn</option>
					<option value="PL">Poland</option>
					<option value="PT">Portugal</option>
					<option value="PR">Puerto Rico</option>
					<option value="QA">Qatar</option>
					<option value="RE">Reunion</option>
					<option value="RO">Romania</option>
					<option value="RU">Russian Federation</option>
					<option value="RW">Rwanda</option>
					<option value="BL">Saint Barthelemy</option>
					<option value="SH">Saint Helena</option>
					<option value="KN">Saint Kitts and Nevis</option>
					<option value="LC">Saint Lucia</option>
					<option value="MF">Saint Martin</option>
					<option value="PM">Saint Pierre and Miquelon</option>
					<option value="VC">Saint Vincent and the Grenadines</option>
					<option value="WS">Samoa</option>
					<option value="SM">San Marino</option>
					<option value="ST">Sao Tome and Principe</option>
					<option value="SA">Saudi Arabia</option>
					<option value="SN">Senegal</option>
					<option value="RS">Serbia</option>
					<option value="CS">Serbia and Montenegro</option>
					<option value="SC">Seychelles</option>
					<option value="SL">Sierra Leone</option>
					<option value="SG">Singapore</option>
					<option value="SX">Sint Maarten</option>
					<option value="SK">Slovakia</option>
					<option value="SI">Slovenia</option>
					<option value="SB">Solomon Islands</option>
					<option value="SO">Somalia</option>
					<option value="ZA">South Africa</option>
					<option value="GS">
						South Georgia and the South Sandwich Islands
					</option>
					<option value="SS">South Sudan</option>
					<option value="ES">Spain</option>
					<option value="LK">Sri Lanka</option>
					<option value="SD">Sudan</option>
					<option value="SR">Suriname</option>
					<option value="SJ">Svalbard and Jan Mayen</option>
					<option value="SZ">Swaziland</option>
					<option value="SE">Sweden</option>
					<option value="CH">Switzerland</option>
					<option value="SY">Syrian Arab Republic</option>
					<option value="TW">Taiwan, Province of China</option>
					<option value="TJ">Tajikistan</option>
					<option value="TZ">Tanzania, United Republic of</option>
					<option value="TH">Thailand</option>
					<option value="TL">Timor-Leste</option>
					<option value="TG">Togo</option>
					<option value="TK">Tokelau</option>
					<option value="TO">Tonga</option>
					<option value="TT">Trinidad and Tobago</option>
					<option value="TN">Tunisia</option>
					<option value="TR">Turkey</option>
					<option value="TM">Turkmenistan</option>
					<option value="TC">Turks and Caicos Islands</option>
					<option value="TV">Tuvalu</option>
					<option value="UG">Uganda</option>
					<option value="UA">Ukraine</option>
					<option value="AE">United Arab Emirates</option>
					<option value="GB">United Kingdom</option>
					<option value="US">United States</option>
					<option value="UM">
						United States Minor Outlying Islands
					</option>
					<option value="UY">Uruguay</option>
					<option value="UZ">Uzbekistan</option>
					<option value="VU">Vanuatu</option>
					<option value="VE">Venezuela</option>
					<option value="VN">Viet Nam</option>
					<option value="VG">Virgin Islands, British</option>
					<option value="VI">Virgin Islands, U.s.</option>
					<option value="WF">Wallis and Futuna</option>
					<option value="EH">Western Sahara</option>
					<option value="YE">Yemen</option>
					<option value="ZM">Zambia</option>
					<option value="ZW">Zimbabwe</option>
				</select>
			</div>
			<div
				className={`${style.mail} ${style.formMargin}`}
				hidden={!props.needMail}
			>
				<label htmlFor="emailField">Mail</label>
				<input
					placeholder="Email"
					name="mail"
					id="emailField"
					value={props.state.mail}
					onChange={handleChange}
					disabled={props.validated}
					required
				/>
			</div>
		</form>
	);
};

export default Purchase;
export {Purchase, PrePurchase};
