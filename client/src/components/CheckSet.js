const CheckSet = param => {
	return (
		<fieldset>
			{param.set.map((item, i) => {
				return (
					<div key={i}>
						<input
							type={param.type}
							name={item.name}
							value={item.value}
							onChange={param.onChange}
							checked={item.checked}
						/>
						<label>{item.label}</label>
					</div>
				);
			})}
		</fieldset>
	);
};

export default CheckSet;
