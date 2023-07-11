import style from "../style/ToggleButton.module.scss";

/**
 * @brief ToggleButton component (very useful) for filter menu
 */
const ToggleButton = props => {
	return (
		<label className={style.switch}>
			<input type="checkbox" {...props} />
			<span className={style.slider}></span>
		</label>
	);
};

export default ToggleButton;
