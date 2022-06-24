const CheckSet = param => {
	return (
		<fieldset>
			{param.set.map(item => {
				return (
					<div>
						<input
							type={param.type}
							name={param.setName}
							defaultChecked={item.defaultChecked}
							value={item.value}
							onChange={param.onChange}
						/>
						<label>{item.name}</label>
					</div>
				);
			})}
		</fieldset>
	);
};

export default CheckSet;
