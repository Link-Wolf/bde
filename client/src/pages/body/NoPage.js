import {useRef, React} from "react";
import style from "../../style/NoPage.module.css";

const NoPage = () => {
	const mouseX = useRef();
	const mouseY = useRef();

	document.addEventListener("mousemove", e => {
		mouseY.current = e.pageY;
		mouseX.current = e.pageX;
	});

	return (
		<>
			<div className={style.text}>
				<h3>test</h3>
			</div>
			<div
				className={style.torch}
				style={{top: `${mouseX.current}`, bottom: `${mouseY.current}`}}
			></div>
		</>
	);
};

export default NoPage;
