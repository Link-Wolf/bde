import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {Pagination, Navigation} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import abel from "../assets/placeholders/abel.png";
import yoyo from "../assets/placeholders/yohan.png";
import caro from "../assets/placeholders/caroline.png";
import iman from "../assets/placeholders/imane.png";
import phol from "../assets/placeholders/longPlaceholder.jpg";

import style from "../style/swiper.module.css";
import "../style/swiper.css";

const ShowcaseCarousel = () => {
	return (
		<>
			<Swiper
				slidesPerView={1}
				spaceBetween={500}
				centeredSlides={true}
				pagination={{
					clickable: true
				}}
				modules={[Pagination, Navigation]}
				loop
				navigation={true}
			>
				{[
					{src: abel},
					{src: yoyo},
					{src: caro},
					{src: iman},
					{src: phol}
				].map((slideContent, index) => (
					<SwiperSlide key={index} virtualIndex={index} loop>
						<div className={style.centerbitch}>
							<img
								src={slideContent.src}
								height="max"
								effect="blur"
							/>
						</div>
					</SwiperSlide>
				))}
				<SwiperSlide loop>
					<div className={style.centerbitch}>Bite</div>
				</SwiperSlide>
			</Swiper>
		</>
	);
};

export default ShowcaseCarousel;
