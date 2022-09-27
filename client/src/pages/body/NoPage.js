import {useRef, React} from "react";
import style from "../../style/NoPage.module.css";

const NoPage = () => {
	// document.mousemove(function(event) {
	// 	// document.getElementsByClassName(".torch").forEach(item => {
	// 	// 	item.css({
	// 	// 		top: event.pageY,
	// 	// 		left: event.pageX
	// 	// 	});
	// 	// });
	// 	console.log("mouve");
	// });
	const mouseX = useRef();
	const mouseY = useRef();

	document.addEventListener("mousemove", e => {
		mouseY.current = e.pageY;
		mouseX.current = e.pageX;
	});

	return (
		<>
			<div className={style.text}>
				<h1>404</h1>
				<h2>Uh, Ohh</h2>
				<h3>
					Sorry we cant find what you are looking for 'cuz its so dark
					in here
				</h3>
			</div>
			<div
				className={style.torch}
				style={{top: `${mouseX.current}`, bottom: `${mouseY.current}`}}
			></div>
		</>
	);
};

export default NoPage;
