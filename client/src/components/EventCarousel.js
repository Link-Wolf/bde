import Carousel from "react-bootstrap/Carousel";

import abel from "../images/abel.png";
import yoyo from "../images/yohan.png";
import caro from "../images/caroline.png";
import iman from "../images/imane.png";

import style from "../style/EventCarousel.module.css";

const EventCarousel = () => {
	return (
		<div>
			<Carousel fade>
				<Carousel.Item>
					<div className={style.image_div}>
						<img
							className="d-block w-100"
							src={abel}
							alt="First slide"
						/>
					</div>
					<Carousel.Caption>
						<h3>Abel</h3>
						<p>Le techboi tro coul</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<div className={style.image_div}>
						<img
							className="d-block w-100"
							src={yoyo}
							alt="Second slide"
						/>
					</div>
					<Carousel.Caption>
						<h3>Yohan</h3>
						<p>attention il tig a vue</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<div className={style.image_div}>
						<img
							className="d-block w-100"
							src={caro}
							alt="Third slide"
						/>
					</div>
					<Carousel.Caption>
						<h3>Caroline</h3>
						<p>
							<s>Maman</s> Amirale
						</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<div className={style.image_div}>
						<img
							className="d-block w-100"
							src={iman}
							alt="Third slide"
						/>
					</div>
					<Carousel.Caption>
						<h3>Imane</h3>
						<p>Elle nous trouve des thunes</p>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		</div>
	);
};

export default EventCarousel;
