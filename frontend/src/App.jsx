import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Articles from "./pages/Articles"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Logout from "./pages/Logout"
import { GuestRoute, ProtectedRoute } from "./routes/ProtectedRoute"
import "./App.css"

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Articles />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
