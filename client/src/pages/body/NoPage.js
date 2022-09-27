import {useState, React} from "react";
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
	const [mouseX, setMouseX] = useState(0);
	const [mouseY, setMouseY] = useState(0);

	document.addEventListener("mousemove", e => {
		setMouseY(e.pageY);
		setMouseX(e.pageX);
	});

	return (
		<>
			<div className={style.body}>
				<div className={style.text}>
					<h1>404</h1>
					<h2>UwUn't</h2>
					<h3>Tu t'es perdu dans les ombres.</h3>
				</div>
				<div
					className={style.torch}
					style={{
						position: "absolute",
						left: `${mouseX}px`,
						top: `${mouseY}px`
					}}
				></div>
			</div>
		</>
	);
};

export default NoPage;
