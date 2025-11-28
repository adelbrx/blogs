import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthCard from "../components/layout/AuthCard"
import Input from "../components/form/Input"
import Button from "../components/form/Button"
import ErrorMessage from "../components/form/ErrorMessage"
import { useAuth } from "../context/AuthContext"

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setLoading(true)
    const result = await register({ email: email.trim(), password, fullName: fullName.trim() })
    setLoading(false)
    if (!result.ok) {
      setError(result.message || "Unable to create account")
      return
    }
    navigate("/", { replace: true })
  }

  return (
    <div className="auth-shell">
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="ambient ambient-3" />
      <AuthCard
        title="Create account"
        subtitle="Publish articles, manage drafts, and collaborate securely."
        footer={
          <p>
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        }
      >
        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Full name (optional)"
            type="text"
            placeholder="Ada Lovelace"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            rightSlot={
              <button
                type="button"
                className="peek"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            }
          />
          <Button type="submit" loading={loading} fullWidth>
            {loading ? "Creating..." : "Create account"}
          </Button>
          <ErrorMessage message={error} />
        </form>
      </AuthCard>
    </div>
  )
}

export default Register
