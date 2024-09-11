import { Navigate } from "react-router-dom";

import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  let user = JSON.parse(localStorage.getItem("SpeakEasyUser") as string);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
