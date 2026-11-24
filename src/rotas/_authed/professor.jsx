import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { painelDoPerfil, pode } from "@/lib/perfis";
import { listarFichasCriadasPorMim } from "@/lib/server-fns";
import { useAsync } from "@/hooks/useAsync";
import PainelTopo from "@/components/painel/PainelTopo";
import AcessoRestrito from "@/components/painel/AcessoRestrito";
import InscritosTable from "@/components/inscricoes/InscritosTable";

export const Route = createFileRoute("/_authed/professor")({
  ssr: false,
  head: () => ({ meta: [{ title: "Painel do professor" }] }),
  component: ProfessorPage,
});

function ProfessorPage() {
  const { user, isLoadingAuth } = useAuth();
  const autorizado = pode(user, "criarFicha");
  const fichas = useAsync(async () => (autorizado ? listarFichasCriadasPorMim() : null), [autorizado]);

  if (isLoadingAuth) {
    return <div className="arena-container py-20 text-sm text-arena-gray">Carregando painel…</div>;
  }
  if (!autorizado) {
    return <AcessoRestrito perfilNecessario="professor" painel={painelDoPerfil(user)} />;
  }

  const inscritos = fichas.data?.inscritos ?? [];

  return (
    <>
      <PainelTopo
        eyebrow="Professor"
        title="Minhas fichas"
        description="Você pode criar fichas de última hora e acompanhar as inscrições que enviou. A confirmação é feita pela organização."
        actions={
          <Link
            to="/nova-inscricao"
            className="inline-flex items-center gap-2 rounded-full bg-arena-yellow px-5 py-3 font-display text-[11.5px] font-bold uppercase tracking-[0.1em] text-arena-ink transition-colors hover:bg-white"
          >
            <Plus className="h-4 w-4" /> Nova ficha de última hora
          </Link>
        }
      />

      <div className="arena-container space-y-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold uppercase text-arena-ink">Fichas enviadas</h2>
            <p className="mt-1 text-[12.5px] text-arena-gray">
              {inscritos.length} {inscritos.length === 1 ? "ficha" : "fichas"} criadas por você.
            </p>
          </div>
          {fichas.error ? (
            <button
              type="button"
              onClick={fichas.reload}
              className="rounded-full border border-black/10 px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-arena-ink"
            >
              Tentar novamente
            </button>
          ) : null}
        </div>

        {fichas.loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-arena-mist" />
        ) : (
          <InscritosTable inscritos={inscritos} />
        )}
      </div>
    </>
  );
}