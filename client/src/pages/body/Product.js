import {useState, useEffect, React} from "react";
import {useParams, Navigate} from "react-router-dom";
import NoPage from "./NoPage";
import Me from "./Me";
import {Card, CardBody, CardTitle, CardSubtitle, CardText} from "reactstrap";

const Product = () => {
	const [dataProduct, setDataProduct] = useState(<></>);
	const [thumbnail, setThumbnail] = useState(null);
	const param = useParams();

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/goodies/${param.id}/thumbnail`,
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
				setThumbnail(URL.createObjectURL(blob));
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/goodies/${param.id}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					setDataProduct(<Navigate to="/home" />);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(d => {
				setDataProduct(
					<Card
						style={{
							width: "18rem"
						}}
					>
						<img src={thumbnail} />
						<CardBody>
							<CardTitle tag="h5"> {d.name}</CardTitle>
							<CardSubtitle tag="h6">
								{`Prix : ${d.cost}`}
							</CardSubtitle>
							<CardText>{d.desc}</CardText>
						</CardBody>
					</Card>
				);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [param.id]);

	return <> {dataProduct}</>;
};
export default Product;
