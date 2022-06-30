import {useEffect, useState} from "react";

const AdminEventToken = param => {
	const [ret, setRet] = useState(<></>);
	const [locked, setLocked] = useState(true);
	const [button, setButton] = useState(<></>);
	const [update, setUpdate] = useState(false);

	const switchLock = () => {
		setLocked(false);
		setUpdate(true);
	};

	const saveEvent = () => {
		setLocked(true);
		setUpdate(true);
	};

	useEffect(() => {
		setUpdate(false);
		if (locked)
			setButton(
				<button type="button" value={param.index} onClick={switchLock}>
					Edit
				</button>
			);
		else
			setButton(
				<button type="button" value={param.index} onClick={saveEvent}>
					Save
				</button>
			);
		if (param.index != param.open)
			setRet(
				<>
					<button value={param.index} onClick={param.onClickDeploy}>
						{param.data.name} {param.data.begin_date}
					</button>
					<br />
				</>
			);
		else
			setRet(
				<form>
					<div>
						<label>Name : </label>
						<input
							disabled={locked}
							type="text"
							value={param.data.name}
						/>
					</div>
					<div>
						<label> Dates : </label>
						<input
							disabled={locked}
							type="date"
							value={param.data.begin_date}
						/>
						{" - "}
						<input
							disabled={locked}
							type="date"
							value={param.data.end_date}
						/>
						<input
							disabled={locked}
							type="checkbox"
							checked={param.data.end_date != null}
						/>
					</div>
					<div>
						<label>Description : </label>
						<textarea disabled={locked}>{param.data.desc}</textarea>
					</div>
					<div>
						<label>Prix : </label>
						<input
							disabled={locked}
							type="number"
							min="0"
							step="0.01"
							value={param.data.cost}
						/>{" "}
						€ (
						<input
							disabled={locked}
							type="number"
							min="0"
							step="0.01"
							value={param.data.premium_cost}
						/>{" "}
						€ )
					</div>
					<div>
						<label>Places : </label>
						{" ? / "}
						<input
							disabled={locked}
							type="number"
							min="1"
							value={param.data.nb_places}
						/>
					</div>
					<div>
						<label>Lieu : </label>
						<input
							disabled={locked}
							type="text"
							value={param.data.place}
						/>
					</div>
					<button
						type="button"
						value={param.index}
						onClick={param.onClickRetract}
					>
						Retract
					</button>
					{button}
				</form>
			);
	}, [param, update]);

	return ret;
};

export default AdminEventToken;
