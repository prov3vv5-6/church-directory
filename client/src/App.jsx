import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DirectoryPage from "./pages/DirectoryPage";
import MemberProfilePage from "./pages/MemberProfilePage";
import SettingsLayout from "./pages/settings/SettingsLayout";
import ProfileSettingsPage from "./pages/settings/ProfileSettingsPage";
import SecurityPage from "./pages/settings/SecurityPage";

// Wraps any route that requires the user to be logged in.
// If there's no token in context, redirect to /login instead of rendering children.
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes */}
          <Route
            path="/directory"
            element={
              <ProtectedRoute>
                <DirectoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <MemberProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/settings"
            element={
              <ProtectedRoute>
                <SettingsLayout />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<ProfileSettingsPage />} />
            <Route path="security" element={<SecurityPage />} />
          </Route>

          {/* Redirect old edit URL so any bookmarks still work */}
          <Route path="/profile/edit" element={<Navigate to="/profile/settings/profile" replace />} />

          {/* Default: go to directory if logged in, else login */}
          <Route path="*" element={<Navigate to="/directory" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
