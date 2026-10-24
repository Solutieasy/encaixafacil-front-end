import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";

function AppContent() {
  const { screen } = useAuth();

  if (screen === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-100">
        <p className="text-brand-900">Carregando...</p>
      </main>
    );
  }

  if (screen === "register") return <RegisterPage />;
  if (screen === "subscription") return <SubscriptionPage />;
  if (screen === "checkout-success") return <CheckoutSuccessPage />;
  if (screen === "dashboard") return <DashboardPage />;

  return <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
