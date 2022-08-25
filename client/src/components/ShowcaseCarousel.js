import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {Pagination} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/virtual";
import abel from "../assets/placeholders/abel.png";
import yoyo from "../assets/placeholders/yohan.png";
import caro from "../assets/placeholders/caroline.png";
import iman from "../assets/placeholders/imane.png";

const ShowcaseCarousel = () => {
	return (
		<Swiper
			slidesPerView={1}
			spaceBetween={500}
			centeredSlides={true}
			pagination={{
				clickable: true
			}}
			modules={[Pagination]}
			className="mySwiper"
		>
			{[{src: abel}, {src: yoyo}, {src: caro}, {src: iman}].map(
				(slideContent, index) => (
					<SwiperSlide key={slideContent} virtualIndex={index}>
						<LazyLoadImage
							src={slideContent.src}
							height="400"
							effect="blur"
						/>
					</SwiperSlide>
				)
			)}
		</Swiper>
	);
};

export default ShowcaseCarousel;
