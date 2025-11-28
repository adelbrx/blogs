const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  error,
  rightSlot = null,
  autoComplete,
}) => {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className={`input-shell ${error ? "input-shell-error" : ""}`}>
        <input
          className="input"
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        {rightSlot}
      </div>
      {error && <p className="error-text">{error}</p>}
    </label>
  )
}

export default Input
