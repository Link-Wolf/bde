import Carousel from "react-bootstrap/Carousel";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import abel from "../assets/placeholders/abel.png";
import yoyo from "../assets/placeholders/yohan.png";
import caro from "../assets/placeholders/caroline.png";
import iman from "../assets/placeholders/imane.png";

import style from "../style/EventCarousel.module.css";

const EventCarousel = () => {
	return (
		<div>
			<Carousel fade>
				<Carousel.Item>
					<div className={style.image_div}>
						<LazyLoadImage
							alt="First slide"
							height="auto"
							src={abel}
							width="auto"
							effect="blur"
						/>
					</div>
					<Carousel.Caption>
						<h3>Abel</h3>
						<p>Le techboi tro coul</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<div className={style.image_div}>
						<LazyLoadImage
							alt="Second slide"
							height="auto"
							src={yoyo}
							width="auto"
							effect="blur"
						/>
					</div>
					<Carousel.Caption>
						<h3>Yohan</h3>
						<p>attention il tig a vue</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<div className={style.image_div}>
						<LazyLoadImage
							alt="Third slide"
							height="auto"
							src={caro}
							width="auto"
							effect="blur"
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
						<LazyLoadImage
							alt="Fourth slide"
							height="auto"
							src={iman}
							width="auto"
							effect="blur"
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
