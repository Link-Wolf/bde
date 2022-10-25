import React, {useEffect} from "react";
import useConfirm from "./useConfirm";
import style from "../style/ConfirmModal.module.scss";

const ConfirmModal = () => {
	const {prompt = "", isOpen = false, proceed, cancel} = useConfirm();

	useEffect(() => {
		const handleKeydown = e => {
			if (proceed && isOpen && e.key === "Enter") {
				proceed();
			}
		};
		window.addEventListener("keydown", handleKeydown);
		return () => window.removeEventListener("keydown", handleKeydown);
	}, [proceed, isOpen]);

	return (
		isOpen && (
			<div className={style.popUpContainer}>
				<div></div>
				<div className={style.popUp}>
					<h1>Confirm</h1>
					<p>{prompt}</p>
					<div className={style.buttons}>
						<button onClick={proceed}>Ok</button>
						<button onClick={cancel}>Cancel</button>
					</div>
				</div>
				<div></div>
			</div>
		)
	);
};

export default ConfirmModal;
