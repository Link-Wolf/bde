import Carousel from "react-bootstrap/Carousel";

import placeholder from "../images/placeholder.jpg";
import placeholder2 from "../images/user_placeholder.png";

import "../style/EventCarousel.css";

const EventCarousel = () => {
	return (
		<div>
			<Carousel fade>
				<Carousel.Item>
					<div className="image_div">
						<img
							className="d-block w-100"
							src={placeholder}
							alt="First slide"
						/>
					</div>
					<Carousel.Caption>
						<h3>First slide label</h3>
						<p>
							Nulla vitae elit libero, a pharetra augue mollis
							interdum.
						</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<div className="image_div">
						<img
							className="d-block w-100"
							src={placeholder2}
							alt="Second slide"
						/>
					</div>
					<Carousel.Caption>
						<h3>Second slide label</h3>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit.
						</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<div className="image_div">
						<img
							className="d-block w-100"
							src={placeholder}
							alt="Third slide"
						/>
					</div>
					<Carousel.Caption>
						<h3>Third slide label</h3>
						<p>
							Praesent commodo cursus magna, vel scelerisque nisl
							consectetur.
						</p>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		</div>
	);
};

export default EventCarousel;
