import style from "../style/ToggleButton.module.scss";

const ToggleButton = props => {
	return (
		<label className={style.switch}>
			<input type="checkbox" {...props} />
			<span className={style.slider}></span>
		</label>
	);
};
