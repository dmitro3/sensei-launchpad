import NumberFormat from "react-number-format";

export default function Input({
  className,
  type = "text",
  value,
  onChange,
  onClick,
  title,
  required = true,
  displayType = "text",
  placeholder,
  separator = true,
  errors,
  info,
  children,
  Icon,
  ...props
}) {
  const id = Math.random();

  return (
    <div className={"input-wrapper " + (className ? className : "")}>
      {title && (
        <div className="input-wrapper__header">
          <label
            className={"label" + (required ? " label--required" : "")}
            to={id}
          >
            {title}
          </label>
          {info && <p className="input-wrapper__info">{info}</p>}
        </div>
      )}
      <div
        className={
          type === "textarea"
            ? "input-wrapper__row input-textarea"
            : "input-wrapper__row"
        }
      >
        {children && children}
        {type === "text" ? (
          <input
            type={type}
            className="input-wrapper__input"
            value={value}
            onClick={onClick}
            onChange={onChange}
            id={id}
            placeholder={placeholder}
            {...props}
          />
        ) : type === "textarea" ? (
          <textarea
            className="input-wrapper__input"
            value={value}
            onChange={onChange}
            id={id}
            placeholder={placeholder}
            {...props}
          />
        ) : (
          <NumberFormat
            className="input-wrapper__input"
            value={value}
            onClick={onClick}
            onChange={onChange}
            id={id}
            // thousandSeparator={separator}
            displayType={displayType}
            allowLeadingZeros={false}
            allowNegative={false}
            placeholder={placeholder}
            {...props}
          />
        )}
        {Icon && <Icon className="input-wrapper__icon" />}
      </div>
      {errors && (
        <ul className="input-wrapper__errors">
          {errors.map((item, index) => {
            return (
              <li className="input-wrapper__error" key={index}>
                {item}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
