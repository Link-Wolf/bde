import {useState, useEffect} from "react";
import emailjs from "@emailjs/browser";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer
} from "@paypal/react-paypal-js";

const ContributeButtons = () => {
	const currency = "EUR";
	const [amount, setAmount] = useState();
	const [duration, setDuration] = useState();
	const [accept, setAccept] = useState(false);
	const [session, setSession] = useState({});
	const [address, setAddress] = useState({
		firstname: "",
		lastname: "",
		address_line_1: "",
		address_line_2: "",
		admin_area_2: "",
		postal_code: "",
		country_code: "FR",
		isValid: () =>
			address.firstname !== "" &&
			address.lastname !== "" &&
			address.address_line_1 !== "" &&
			address.address_line_2 !== "" &&
			address.admin_area_2 !== "" &&
			address.postal_code !== ""
	});
	const [contributionStatus, setContributionStatus] = useState(false);
	const style = {layout: "vertical"};
	const [{options, isPending}, dispatch] = usePayPalScriptReducer();

	const sendMail = async (date, commande, timestamp, mail) => {
		await emailjs
			.send(
				global.config.emailjs.service_id,
				global.config.emailjs.template_paiement,
				{
					date: date,
					commande: commande,
					timestamp: timestamp,
					mail: mail
				},
				global.config.emailjs.public_key
			)
			.then(
				result => {
					console.log(result.text);
				},
				error => {
					console.log(error.text);
				}
			)
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération mail: " +
						error.message
				);
			});
	};

	const handleAddressChange = event => {
		let tmp = {...address};
		const target = event.target;
		const value =
			target.type === "checkbox" || target.type === "switch"
				? target.checked
				: target.value;
		const name = target.name;
		tmp[name] = value;
		setAddress(tmp);
	};

	useEffect(() => {
		dispatch({
			type: "resetOptions",
			value: {
				...options,
				currency: currency
			}
		});
	}, [currency]);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/session`, {
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
				setSession(json);
			});
	}, []);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/contribution/info`, {
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
				setDuration(json.duration);
			});
	}, []);

	useEffect(() => {
		if (options.login !== "")
			fetch(
				`http://${global.config.api.authority}/contribution/${session.login}`,
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
					data.forEach((item, i) => {
						if (
							new Date(item.end_date) > Date.now() &&
							new Date(item.begin_date) <= Date.now()
						) {
							setContributionStatus(true);
						}
					});
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
	}, [session]);

	if (contributionStatus) {
		window.location = "/home";
		return <></>;
	}
	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<div>
				<h3>Contribution</h3>
				<ul>
					<li>
						Contribution à l'association d'une durée de {duration}{" "}
						mois.
					</li>
					<li>{amount}€</li>
				</ul>
			</div>
			<div>
				<form>
					<div>
						<input
							placeholder="Nom"
							value={address.lastname}
							name="lastname"
							onChange={handleAddressChange}
							required
						/>
						<input
							placeholder="Prenom"
							value={address.firstname}
							name="firstname"
							onChange={handleAddressChange}
							required
						/>
					</div>
					<div>
						<input
							placeholder="Addresse"
							value={address.address_line_1}
							name="address_line_1"
							onChange={handleAddressChange}
							required
						/>
					</div>
					<div>
						<input
							placeholder="Complement d'addresse (optionnel)"
							value={address.address_line_2}
							name="address_line_2"
							onChange={handleAddressChange}
						/>
					</div>
					<div>
						<input
							placeholder="Code Postal"
							value={address.postal_code}
							name="postal_code"
							onChange={handleAddressChange}
							required
						/>
						<input
							placeholder="Ville"
							value={address.admin_area_2}
							name="admin_area_2"
							onChange={handleAddressChange}
							required
						/>
					</div>
					<div>
						<select
							value={address.country_code}
							name="country_code"
							onChange={handleAddressChange}
						>
							<option>select country</option>
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
							<option value="BQ">
								Bonaire, Sint Eustatius and Saba
							</option>
							<option value="BA">Bosnia and Herzegovina</option>
							<option value="BW">Botswana</option>
							<option value="BV">Bouvet Island</option>
							<option value="BR">Brazil</option>
							<option value="IO">
								British Indian Ocean Territory
							</option>
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
							<option value="FK">
								Falkland Islands (Malvinas)
							</option>
							<option value="FO">Faroe Islands</option>
							<option value="FJ">Fiji</option>
							<option value="FI">Finland</option>
							<option value="FR">France</option>
							<option value="GF">French Guiana</option>
							<option value="PF">French Polynesia</option>
							<option value="TF">
								French Southern Territories
							</option>
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
							<option value="VA">
								Holy See (Vatican City State)
							</option>
							<option value="HN">Honduras</option>
							<option value="HK">Hong Kong</option>
							<option value="HU">Hungary</option>
							<option value="IS">Iceland</option>
							<option value="IN">India</option>
							<option value="ID">Indonesia</option>
							<option value="IR">
								Iran, Islamic Republic of
							</option>
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
							<option value="LA">
								Lao People's Democratic Republic
							</option>
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
							<option value="FM">
								Micronesia, Federated States of
							</option>
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
							<option value="PS">
								Palestinian Territory, Occupied
							</option>
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
							<option value="PM">
								Saint Pierre and Miquelon
							</option>
							<option value="VC">
								Saint Vincent and the Grenadines
							</option>
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
							<option value="TW">
								Taiwan, Province of China
							</option>
							<option value="TJ">Tajikistan</option>
							<option value="TZ">
								Tanzania, United Republic of
							</option>
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
				</form>
				<input
					type="checkbox"
					checked={accept}
					onChange={() => {
						setAccept(!accept);
					}}
				/>{" "}
				J'ai lu et j'accepte les <a href="/legalthings">CGU</a> et les{" "}
				<a href="/dollarthings">GGV</a>
				{accept && address.isValid() ? (
					<PayPalButtons
						style={style}
						forceReRender={[amount, currency, style]}
						fundingSource={undefined}
						createOrder={(data, actions) => {
							return actions.order
								.create({
									purchase_units: [
										{
											amount: {
												currency_code: currency,
												value: amount
											},
											payment_source: {
												name: `${address.firstname} ${address.lastname}`,
												billing_address: {
													address_line_1:
														address.address_line_1,
													address_line_2:
														address.address_line_2,
													admin_area_2:
														address.admin_area_2,
													postal_code:
														address.postal_code,
													country_code:
														address.country_code
													// address_line_1: '1200 Main St',
													// address_line_2: 'Unit 10',
													// admin_area_2: 'Phoenix',
													// admin_area_1: 'AZ',
													// postal_code: '85001',
													// country_code: 'US'
												}
											}
										}
									]
								})
								.then(orderId => {
									const body = JSON.stringify({
										id: orderId,
										studLogin: session.login,
										cost: amount,
										source: data.paymentSource
									});
									fetch(
										`http://${global.config.api.authority}/order/create`,
										{
											method: "POST",
											credentials: "include",
											body: body,
											headers: {
												"Content-Type":
													"application/json"
											}
										}
									);
									return orderId;
								});
						}}
						onApprove={function(data, actions) {
							return actions.order.capture().then(function() {
								const body = JSON.stringify({
									id: data.orderID
								});
								fetch(
									`http://${global.config.api.authority}/order/capture`,
									{
										method: "POST",
										credentials: "include",
										body: body,
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
										return response.json();
									})
									.then(async data => {
										console.log(
											"Here : ",
											data.order,
											data.mail
										);
										await sendMail(
											new Date(
												Date.now()
											).toLocaleDateString("fr-FR", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric"
											}),
											data.order.id,
											new Intl.DateTimeFormat("fr-FR", {
												day: "numeric",
												month: "short",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
												second: "2-digit",
												timeZoneName: "short"
											}).format(
												new Date(data.order.date)
											),
											data.mail
										);
									})
									.then(() => {
										window.location = `/receipt/${data.orderID}`;
									});
							});
						}}
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

const Contribute = () => {
	const [optionsProvider, setOptionsProvider] = useState({
		"client-id": global.config.paypal.id,
		currency: "EUR",
		intent: "capture"
	});

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/paypal/clientToken`, {
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

	return (
		<PayPalScriptProvider options={optionsProvider}>
			<ContributeButtons />
		</PayPalScriptProvider>
	);
};

export default Contribute;
