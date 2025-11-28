import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthCard from "../components/layout/AuthCard"
import Button from "../components/form/Button"
import { useAuth } from "../context/AuthContext"

const Logout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logout()
  }, [logout])

  return (
    <div className="auth-shell">
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="ambient ambient-3" />
      <AuthCard
        title="Signed out"
        subtitle="You have been signed out securely."
        footer={
          <p>
            Changed your mind? <Link to="/login">Sign in again</Link>
          </p>
        }
      >
        <div className="auth-form">
          <Button fullWidth onClick={() => navigate("/login")}>
            Back to login
          </Button>
        </div>
      </AuthCard>
    </div>
  )
}

export default Logout
