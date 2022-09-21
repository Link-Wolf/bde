import ReactToPrint from "react-to-print";
import React from "react";
import logo from "../assets/logos/bde_logo_name.png";

import style from "../style/Invoice.module.css";

class Invoice extends React.Component {
	render() {
		return (
			<>
				<div className={style["invoice-box"]}>
					<table cellPadding="0" cellSpacing="0">
						<tbody>
							<tr className={style.top}>
								<td colSpan="2">
									<table>
										<tbody>
											<tr>
												<td className={style.title}>
													<img
														src={logo}
														style={style.img}
													/>
												</td>

												<td>
													Facture #{this.props.id}
													<br />
													Date : {this.props.date}
													<br />
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>

							<tr className={style.information}>
								<td colSpan="2">
									<table>
										<tbody>
											<tr>
												<td>
													BDE 42 MULHOUSE
													<br />
													30 rue François Spoerry
													<br />
													68100 Mulhouse
												</td>

												<td>
													{this.props.buyer}
													<br />
													{this.props.mail}
													<br />
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>

							<tr className={style.heading}>
								<td>Méthode de paiement</td>
								<td></td>
							</tr>

							<tr className={style.details}>
								<td>{this.props.payement_method}</td>
								<td></td>
							</tr>

							<tr className={style.heading}>
								<td>Produit</td>

								<td>Prix</td>
							</tr>

							<tr className={`${style.item} ${style.last}`}>
								<td>{this.props.item}</td>
								<td>{this.props.price}€</td>
							</tr>

							<tr className={style.total}>
								<td></td>

								<td>Total: {this.props.price}€</td>
							</tr>
						</tbody>
					</table>
				</div>
			</>
		);
	}
}

// <tr className={style.item}>
// 	<td>Website design</td>
//
// 	<td>$300.00</td>
// </tr>
//
// <tr className={style.item}>
// 	<td>Hosting (3 months)</td>
//
// 	<td>$75.00</td>
// </tr>

export default Invoice;

export const Print = React.forwardRef((props, ref) => {
	return (
		<>
			<Invoice
				{...props}
				ref={e => {
					ref = e;
				}}
			/>
			<div>
				<ReactToPrint
					content={() => ref}
					trigger={() => <button>Save</button>}
				/>
			</div>
		</>
	);
});
