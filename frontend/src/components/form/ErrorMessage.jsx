const ErrorMessage = ({ message }) => {
  if (!message) return null
  return <div className="alert">{message}</div>
}

export default ErrorMessage
