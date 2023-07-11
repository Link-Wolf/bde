import style from "../style/Loading.module.scss";

import gear from "../assets/animations/gear_clockwise.gif";
import gear_small from "../assets/animations/gear_clockwise.gif";
import gear_medium from "../assets/animations/gear_clockwise.gif";
import gear_micro from "../assets/animations/gear_clockwise.gif";

/**
 * @brief Lots of loading animations to choose from (they are like all the same with different sizes)
 */

const Loading = () => {
	return <img alt="" src={gear} />;
};

const LoadingSmall = () => {
	return <img alt="" src={gear_small} />;
};

const LoadingMedium = () => {
	return <img alt="" src={gear_medium} />;
};

const LoadingMicro = () => {
	return <img alt="" src={gear_micro} />;
};

export default Loading;
export {Loading, LoadingMedium, LoadingSmall, LoadingMicro};
