import {useEffect, React} from "react";
import style from "../../style/NoPage.module.css";

const NoPage = () => {
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
			<div className={style.torch}></div>
		</>
	);
};

export default NoPage;
