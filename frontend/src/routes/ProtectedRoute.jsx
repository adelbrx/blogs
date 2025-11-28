import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const LoadingScreen = () => (
  <div className="full-screen">
    <div className="panel loading ghost-card">
      <div className="spinner" />
      <p>Loading session...</p>
    </div>
  </div>
)

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

export const GuestRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}

export default ProtectedRoute
