import LoginPage from "@/components/auth/LoginPage";
import HomePage from "@/components/dashboard/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserAuthContextProvider } from "./components/auth/UserAuthContext";
import ConversationPage from "./components/conversation/Conversation";
import LandingPage from "./components/landing/Landing";
import ScenarioPage from "./components/scenario/Scenario";

export default function App() {
  return (
    <UserAuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
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
          <Route
            path="/dashboard/conversation"
            element={
              <ProtectedRoute>
                <ConversationPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </UserAuthContextProvider>
  );
}
