const Button = ({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
}) => {
  const classes = ["btn"]
  classes.push(variant === "ghost" ? "ghost" : "cta")
  if (fullWidth) classes.push("w-full")

  return (
    <button type={type} className={classes.join(" ")} onClick={onClick} disabled={disabled || loading}>
      {loading ? "Loading..." : children}
    </button>
  )
}

export default Button
