import {useState, React} from "react";
import style from "../../style/NoPage.module.scss";

const NoPage = () => {
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
					<h2>Page not found</h2>
					<h3>La Frégate s'est perdue...</h3>
					<h3>tu es sur de ton chemin ?</h3>
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
