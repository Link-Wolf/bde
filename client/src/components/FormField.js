import style from "../style/FormField.module.scss";

/**
 * @brief A component to render a form field
 */
const FormField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    disabled = false,
    labelPosition = "left",
    className = "",
    ...rest
}) => (
    <div className={`${style.formField} ${className}`}>
        {labelPosition === "left" && <label htmlFor={name}>{label}</label>}
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={style.formInput}
            disabled={disabled}
            {...rest}
        />
        {labelPosition === "right" && <label htmlFor={name}>{label}</label>}
    </div>
);

export default FormField;
