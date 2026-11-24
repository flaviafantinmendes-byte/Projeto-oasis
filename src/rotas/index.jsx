import { createFileRoute, redirect } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";

// Entrada do site: quem abre a raiz vai para o login (ou para o painel, se já estiver logado).
export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    let autenticado = false;
    try {
      autenticado = await base44.auth.isAuthenticated();
    } catch {
      autenticado = false;
    }
    throw redirect({ to: autenticado ? "/painel" : "/login" });
  },
  component: () => null,
});