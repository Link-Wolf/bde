import {Card, CardBody, CardTitle, CardSubtitle, CardText} from "reactstrap";

const Shop = () => {
	return (
		<>
			<Card
				style={{
					width: "18rem"
				}}
			>
				<CardBody>
					<CardTitle tag="h5"> Hoodie trop bien</CardTitle>
					<CardSubtitle tag="h6">40 euros</CardSubtitle>

					<CardText>Vraiment top qualite venez acheter svp</CardText>
					<button>Acheter x100</button>
				</CardBody>
			</Card>
		</>
	);
};

export default Shop;
