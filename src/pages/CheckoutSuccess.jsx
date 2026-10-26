// src/pages/CheckoutSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    async function checkPayment() {
      try {
        const data = await api.get(
          `/billing/checkout-status?session_id=${sessionId}`,
        );

        if (data.status === "complete") {
          setStatus("success");
          setEmail(data.customerEmail || "");
        } else {
          setStatus("pending");
        }
      } catch {
        setStatus("error");
      }
    }

    checkPayment();
  }, [sessionId]);

  if (status === "loading") return <p>Verificando pagamento...</p>;

  if (status === "success") {
    return (
      <div>
        <h1>Pagamento confirmado!</h1>
        {email && <p>Confirmação enviada para {email}.</p>}
        <Link to="/dashboard">Ir para o painel</Link>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div>
        <h1>Pagamento em processamento</h1>
        <p>Assim que for confirmado, seu acesso será liberado.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Não foi possível confirmar o pagamento</h1>
      <Link to="/billing">Tentar novamente</Link>
    </div>
  );
}