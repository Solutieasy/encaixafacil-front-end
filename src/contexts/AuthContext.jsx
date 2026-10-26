import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("loading");

  useEffect(() => {
  async function validateSession() {
    const path = window.location.pathname;

    if (path === "/checkout/success") {
      setScreen("checkout-success");
      return;
    }

    const token = sessionStorage.getItem("encaixafacil_token");

    if (!token) {
      setScreen("login");
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setScreen("dashboard");
    } catch {
      sessionStorage.removeItem("encaixafacil_token");
      setUser(null);
      setScreen("login");
    }
  }

  validateSession();
}, []);

  async function login(credentials) {
    const { user: authenticatedUser, token } = await api.login(credentials);

    sessionStorage.setItem("encaixafacil_token", token);
    setUser(authenticatedUser);
    setScreen("dashboard");

    return authenticatedUser;
  }

  function logout() {
    sessionStorage.removeItem("encaixafacil_token");
    setUser(null);
    setScreen("login");
  }

  function goToRegister() {
    setScreen("register");
  }

  function goToLogin() {
    setScreen("login");
  }

  function goToDashboard() {
    setScreen("dashboard");
  }

  function goToSubscription() {
    setScreen("subscription");
  }

  function goToCheckoutSuccess() {
    setScreen("checkout-success");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        screen,
        login,
        logout,
        goToRegister,
        goToLogin,
        goToDashboard,
        goToSubscription,
        goToCheckoutSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
