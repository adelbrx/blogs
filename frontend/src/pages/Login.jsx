import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthCard from "../components/layout/AuthCard"
import Input from "../components/form/Input"
import Button from "../components/form/Button"
import ErrorMessage from "../components/form/ErrorMessage"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
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
    setLoading(true)
    const result = await login({ email: email.trim(), password })
    setLoading(false)
    if (!result.ok) {
      setError(result.message || "Invalid credentials")
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
        title="Sign in"
        subtitle="Access the editor, publish boldly, and keep your drafts safe."
        footer={
          <p>
            No account? <Link to="/register">Create one</Link>
          </p>
        }
      >
        <form className="auth-form" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
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
          <div className="form-actions">
            <Link className="link subtle" to="#">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" loading={loading} fullWidth>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <ErrorMessage message={error} />
        </form>
      </AuthCard>
    </div>
  )
}

export default Login
