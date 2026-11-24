import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { painelDoPerfil, pode } from "@/lib/perfis";
import { atualizarStatusInscricao, obterPainelAdmin } from "@/lib/server-fns";
import { useAsync } from "@/hooks/useAsync";
import PainelTopo from "@/components/painel/PainelTopo";
import AcessoRestrito from "@/components/painel/AcessoRestrito";
import StatsInscritos from "@/components/painel/StatsInscritos";
import InscritosTable from "@/components/inscricoes/InscritosTable";

export const Route = createFileRoute("/_authed/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Painel do administrador" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isLoadingAuth } = useAuth();
  const autorizado = pode(user, "verTodosInscritos");
  const painel = useAsync(async () => (autorizado ? obterPainelAdmin() : null), [autorizado]);

  const alterarStatus = async (id, status) => {
    const resposta = await atualizarStatusInscricao({ data: { id, status } });
    if (!resposta?.autorizado) {
      toast.error("Seu perfil não pode alterar o status.");
      return;
    }
    toast.success("Status atualizado.");
    painel.reload();
  };

  if (isLoadingAuth) {
    return <div className="arena-container py-20 text-sm text-arena-gray">Carregando painel…</div>;
  }
  if (!autorizado) {
    return <AcessoRestrito perfilNecessario="administrador" painel={painelDoPerfil(user)} />;
  }

  const dados = painel.data;

  return (
    <>
      <PainelTopo
        eyebrow="Administrador"
        title="Painel de controle"
        description="Visão geral das inscrições por modalidade e lista completa dos inscritos."
        actions={
          <>
            <Link
              to="/nova-inscricao"
              className="inline-flex items-center gap-2 rounded-full bg-arena-yellow px-5 py-3 font-display text-[11.5px] font-bold uppercase tracking-[0.1em] text-arena-ink transition-colors hover:bg-white"
            >
              <Plus className="h-4 w-4" /> Nova ficha
            </Link>
            <Link
              to="/perfis"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 font-display text-[11.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              <ShieldCheck className="h-4 w-4" /> Perfis de acesso
            </Link>
          </>
        }
      />

      <div className="arena-container space-y-10 py-10">
        <StatsInscritos
          total={dados?.total ?? 0}
          porModalidade={dados?.porModalidade ?? {}}
          loading={painel.loading}
        />

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-arena-ink">Inscritos</h2>
              <p className="mt-1 text-[12.5px] text-arena-gray">
                Nome, peso, categoria, contato e demais dados de cada ficha.
              </p>
            </div>
            {painel.error ? (
              <button
                type="button"
                onClick={painel.reload}
                className="rounded-full border border-black/10 px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-arena-ink"
              >
                Tentar novamente
              </button>
            ) : null}
          </div>

          {painel.loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-arena-mist" />
          ) : (
            <InscritosTable
              inscritos={dados?.inscritos ?? []}
              showStatusActions
              onStatusChange={alterarStatus}
            />
          )}
        </section>
      </div>
    </>
  );
}