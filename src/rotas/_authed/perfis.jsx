import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { PAINEL_DO_PERFIL, PERFIS, painelDoPerfil, perfilEfetivo, pode } from "@/lib/perfis";
import { definirPerfilUsuario, listarUsuarios } from "@/lib/server-fns";
import { useAsync } from "@/hooks/useAsync";
import PainelTopo from "@/components/painel/PainelTopo";
import AcessoRestrito from "@/components/painel/AcessoRestrito";

export const Route = createFileRoute("/_authed/perfis")({
  ssr: false,
  head: () => ({ meta: [{ title: "Perfis de acesso" }] }),
  component: PerfisPage,
});

function PerfisPage() {
  const { user, isLoadingAuth } = useAuth();
  const autorizado = pode(user, "gerenciarPerfis");
  const usuarios = useAsync(async () => (autorizado ? listarUsuarios() : null), [autorizado]);

  const trocarPerfil = async (id, perfil) => {
    const resposta = await definirPerfilUsuario({ data: { id, perfil } });
    if (!resposta?.autorizado) {
      toast.error("Apenas administradores podem alterar perfis.");
      return;
    }
    toast.success("Perfil atualizado.");
    usuarios.reload();
  };

  if (isLoadingAuth) {
    return <div className="arena-container py-20 text-sm text-arena-gray">Carregando…</div>;
  }
  if (!autorizado) {
    return <AcessoRestrito perfilNecessario="administrador" painel={painelDoPerfil(user)} />;
  }

  const lista = usuarios.data?.usuarios ?? [];

  return (
    <>
      <PainelTopo
        eyebrow="Administrador"
        title="Perfis de acesso"
        description="Administrador tem acesso total, professor cria fichas e competidor consulta apenas as próprias inscrições."
      />

      <div className="arena-container space-y-6 py-10">
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(PERFIS).map(([chave, perfil]) => (
            <div key={chave} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <p className="font-display text-[13px] font-bold uppercase text-arena-ink">{perfil.label}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-arena-gray">{perfil.descricao}</p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-arena-red">
                Painel: {PAINEL_DO_PERFIL[chave]}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-black/[0.07] bg-arena-mist/60 text-[10px] uppercase tracking-[0.14em] text-arena-gray">
                <th className="px-4 py-3 font-bold">Usuário</th>
                <th className="px-4 py-3 font-bold">Perfil efetivo</th>
                <th className="px-4 py-3 font-bold">Alterar perfil</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((usuario) => (
                <tr key={usuario.id} className="border-b border-black/[0.05] last:border-0">
                  <td className="px-4 py-3.5">
                    <p className="text-[13px] font-semibold text-arena-ink">{usuario.full_name || "Sem nome"}</p>
                    <p className="text-[11.5px] text-arena-gray">{usuario.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] uppercase text-arena-ink">
                    {PERFIS[perfilEfetivo(usuario)]?.label ?? "Competidor"}
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      value={usuario.perfil ?? "competidor"}
                      onChange={(evento) => trocarPerfil(usuario.id, evento.target.value)}
                      aria-label={`Perfil de ${usuario.email}`}
                      className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[12px] text-arena-ink outline-none focus:border-arena-red"
                    >
                      {Object.entries(PERFIS).map(([chave, perfil]) => (
                        <option key={chave} value={chave}>
                          {perfil.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarios.loading ? <p className="px-4 py-6 text-sm text-arena-gray">Carregando usuários…</p> : null}
          {!usuarios.loading && !lista.length ? (
            <p className="px-4 py-6 text-sm text-arena-gray">Nenhum usuário cadastrado ainda.</p>
          ) : null}
        </div>
      </div>
    </>
  );
}