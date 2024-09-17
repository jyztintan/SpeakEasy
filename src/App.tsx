import LoginPage from "@/components/auth/LoginPage";
import HomePage from "@/components/dashboard/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserAuthContextProvider } from "./components/auth/UserAuthContext";
import "./App.css";
import ScenarioPage from "./components/scenario/Scenario";

export default function App() {
  return (
    <UserAuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/scenario"
            element={
              <ProtectedRoute>
                <ScenarioPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </UserAuthContextProvider>
  );
}
