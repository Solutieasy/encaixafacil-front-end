import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

const routes = {
  login: "/",
  register: "/register",
  subscription: "/subscription",
  "checkout-success": "/checkout/success",
  dashboard: "/dashboard",
};

function getPath(screen) {
  return routes[screen] || "/";
}

function getScreenFromPath(path) {
  if (path === "/register") return "register";
  if (path === "/subscription") return "subscription";
  if (path === "/checkout/success") return "checkout-success";
  if (path === "/dashboard") return "dashboard";

  return "login";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("loading");

  function changeScreen(nextScreen) {
    const path = getPath(nextScreen);

    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }

    setScreen(nextScreen);
  }

  useEffect(() => {
    async function validateSession() {
      const path = window.location.pathname;

      if (path === "/checkout/success") {
        setScreen("checkout-success");
        return;
      }

      const token = localStorage.getItem("encaixafacil_token");

      if (!token) {
        setScreen("login");
        return;
      }

      try {
        const data = await api.getMe();
        setUser(data.user);
        setScreen("dashboard");
      } catch {
        localStorage.removeItem("encaixafacil_token");
        setUser(null);
        setScreen("login");
      }
    }

    validateSession();
  }, []);

  useEffect(() => {
    function handlePopState() {
      setScreen(getScreenFromPath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  async function login(credentials) {
    const { user: authenticatedUser, token } = await api.login(credentials);

    localStorage.setItem("encaixafacil_token", token);
    setUser(authenticatedUser);
    changeScreen("dashboard");

    return authenticatedUser;
  }

  function logout() {
    localStorage.removeItem("encaixafacil_token");
    setUser(null);
    changeScreen("login");
  }

  function goToRegister() {
    changeScreen("register");
  }

  function goToLogin() {
    changeScreen("login");
  }

  function goToDashboard() {
    changeScreen("dashboard");
  }

  function goToSubscription() {
    changeScreen("subscription");
  }

  function goToCheckoutSuccess() {
    changeScreen("checkout-success");
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