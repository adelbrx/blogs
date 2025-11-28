const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <p className="kicker">Welcome</p>
        <h2>{title}</h2>
        {subtitle && <p className="lede">{subtitle}</p>}
      </div>
      <div className="auth-card__body">{children}</div>
      {footer && <div className="auth-card__footer">{footer}</div>}
    </div>
  )
}

export default AuthCard
