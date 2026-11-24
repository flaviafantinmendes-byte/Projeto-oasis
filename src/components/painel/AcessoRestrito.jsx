import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export default function AcessoRestrito({ perfilNecessario, painel = "/competidor" }) {
  return (
    <div className="arena-container py-16">
      <div className="mx-auto max-w-lg rounded-2xl border border-black/[0.07] bg-white p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-arena-red" />
        <h1 className="mt-4 font-display text-xl font-bold uppercase text-arena-ink">Acesso restrito</h1>
        <p className="mt-2 text-sm leading-relaxed text-arena-gray">
          Esta área é exclusiva do perfil {perfilNecessario}. Seu perfil atual não tem essa permissão.
        </p>
        <Link
          to={painel}
          className="mt-6 inline-flex rounded-full bg-arena-red px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-arena-orange"
        >
          Ir para o meu painel
        </Link>
      </div>
    </div>
  );
}