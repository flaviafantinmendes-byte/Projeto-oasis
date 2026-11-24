import { createFileRoute, redirect } from "@tanstack/react-router";
import { painelDoPerfil } from "@/lib/perfis";

// Encaminha cada pessoa para o painel do seu perfil.
export const Route = createFileRoute("/_authed/painel")({
  ssr: false,
  beforeLoad: ({ context }) => {
    throw redirect({ to: painelDoPerfil(context.user) });
  },
  component: () => null,
});