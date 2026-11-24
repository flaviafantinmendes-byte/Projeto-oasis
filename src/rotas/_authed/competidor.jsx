import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { perfilLabel } from "@/lib/perfis";
import { listarMinhasInscricoes } from "@/lib/server-fns";
import { useAsync } from "@/hooks/useAsync";
import PainelTopo from "@/components/painel/PainelTopo";
import InscritosTable from "@/components/inscricoes/InscritosTable";

export const Route = createFileRoute("/_authed/competidor")({
  ssr: false,
  head: () => ({ meta: [{ title: "Minhas inscrições" }] }),
  component: CompetidorPage,
});

function CompetidorPage() {
  const { user, isLoadingAuth } = useAuth();
  const minhas = useAsync(async () => (user ? listarMinhasInscricoes() : null), [user?.id]);

  if (isLoadingAuth) {
    return <div className="arena-container py-20 text-sm text-arena-gray">Carregando painel…</div>;
  }

  const inscritos = minhas.data?.inscritos ?? [];

  return (
    <>
      <PainelTopo
        eyebrow={perfilLabel(user) || "Competidor"}
        title="Minhas inscrições"
        description="Consulta das fichas vinculadas ao seu e-mail. Para inscrever outro atleta, procure seu professor ou a organização."
      />

      <div className="arena-container space-y-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold uppercase text-arena-ink">Fichas</h2>
            <p className="mt-1 text-[12.5px] text-arena-gray">
              {inscritos.length} {inscritos.length === 1 ? "inscrição encontrada" : "inscrições encontradas"} para{" "}
              {user?.email ?? "seu e-mail"}.
            </p>
          </div>
          {minhas.error ? (
            <button
              type="button"
              onClick={minhas.reload}
              className="rounded-full border border-black/10 px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-arena-ink"
            >
              Tentar novamente
            </button>
          ) : null}
        </div>

        {minhas.loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-arena-mist" />
        ) : (
          <InscritosTable inscritos={inscritos} />
        )}
      </div>
    </>
  );
}