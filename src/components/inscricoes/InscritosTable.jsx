import StatusBadge from "./StatusBadge";

const valor = (dado) => (dado === null || dado === undefined || dado === "" ? "—" : dado);

export default function InscritosTable({ inscritos = [], onStatusChange, showStatusActions = false }) {
  if (!inscritos.length) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-14 text-center">
        <p className="font-display text-base font-bold uppercase text-arena-ink">Nenhuma ficha encontrada</p>
        <p className="mt-2 text-sm text-arena-gray">As inscrições aparecem aqui assim que forem criadas.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-black/[0.07] bg-white lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-black/[0.07] bg-arena-mist/60 text-[10px] uppercase tracking-[0.14em] text-arena-gray">
              <th className="px-4 py-3 font-bold">Competidor</th>
              <th className="px-4 py-3 font-bold">Modalidade</th>
              <th className="px-4 py-3 font-bold">Idade / Categoria</th>
              <th className="px-4 py-3 font-bold">Sexo</th>
              <th className="px-4 py-3 font-bold">Peso / Divisão</th>
              <th className="px-4 py-3 font-bold">Equipe</th>
              <th className="px-4 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {inscritos.map((inscrito) => (
              <tr key={inscrito.id} className="border-b border-black/[0.05] align-top last:border-0">
                <td className="px-4 py-3.5">
                  <p className="text-[13px] font-semibold text-arena-ink">{valor(inscrito.nome_completo)}</p>
                  <p className="mt-0.5 text-[11.5px] text-arena-gray">{valor(inscrito.email)}</p>
                  <p className="text-[11.5px] text-arena-gray">{valor(inscrito.telefone)}</p>
                  {inscrito.observacoes ? (
                    <p className="mt-1 max-w-[220px] text-[11px] italic text-arena-gray">{inscrito.observacoes}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-[12.5px] font-semibold uppercase text-arena-ink">{valor(inscrito.modalidade)}</p>
                  {inscrito.faixa ? <p className="text-[11.5px] text-arena-gray">Faixa {inscrito.faixa}</p> : null}
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-[12.5px] text-arena-ink">{valor(inscrito.categoria_idade)}</p>
                  <p className="text-[11.5px] text-arena-gray">{inscrito.idade != null ? `${inscrito.idade} anos` : "—"}</p>
                </td>
                <td className="px-4 py-3.5 text-[12.5px] text-arena-ink">{valor(inscrito.sexo)}</td>
                <td className="px-4 py-3.5">
                  <p className="text-[12.5px] text-arena-ink">{inscrito.peso_kg ? `${inscrito.peso_kg} kg` : "—"}</p>
                  <p className="text-[11.5px] text-arena-gray">{valor(inscrito.categoria_peso)}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-[12.5px] text-arena-ink">{valor(inscrito.equipe)}</p>
                  <p className="text-[11.5px] text-arena-gray">{valor(inscrito.cidade)}</p>
                  <p className="text-[11.5px] text-arena-gray">Resp.: {valor(inscrito.responsavel)}</p>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={inscrito.status} />
                  {showStatusActions && onStatusChange ? (
                    <select
                      value={inscrito.status ?? "pendente"}
                      onChange={(evento) => onStatusChange(inscrito.id, evento.target.value)}
                      aria-label={`Alterar status de ${inscrito.nome_completo}`}
                      className="mt-2 w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11.5px] text-arena-ink outline-none focus:border-arena-red"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="grid gap-3 lg:hidden">
        {inscritos.map((inscrito) => (
          <article key={inscrito.id} className="rounded-2xl border border-black/[0.07] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-bold text-arena-ink">{valor(inscrito.nome_completo)}</p>
                <p className="text-[11.5px] text-arena-gray">{valor(inscrito.email)}</p>
              </div>
              <StatusBadge status={inscrito.status} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11.5px]">
              <div>
                <dt className="text-arena-gray">Modalidade</dt>
                <dd className="font-semibold text-arena-ink">{valor(inscrito.modalidade)}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Categoria</dt>
                <dd className="font-semibold text-arena-ink">{valor(inscrito.categoria_idade)}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Idade</dt>
                <dd className="text-arena-ink">{inscrito.idade != null ? `${inscrito.idade} anos` : "—"}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Sexo</dt>
                <dd className="text-arena-ink">{valor(inscrito.sexo)}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Peso</dt>
                <dd className="text-arena-ink">{inscrito.peso_kg ? `${inscrito.peso_kg} kg` : "—"}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Divisão</dt>
                <dd className="text-arena-ink">{valor(inscrito.categoria_peso)}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Equipe</dt>
                <dd className="text-arena-ink">{valor(inscrito.equipe)}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Telefone</dt>
                <dd className="text-arena-ink">{valor(inscrito.telefone)}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Responsável</dt>
                <dd className="text-arena-ink">{valor(inscrito.responsavel)}</dd>
              </div>
              <div>
                <dt className="text-arena-gray">Cidade</dt>
                <dd className="text-arena-ink">{valor(inscrito.cidade)}</dd>
              </div>
            </dl>
            {inscrito.observacoes ? (
              <p className="mt-2 text-[11.5px] italic text-arena-gray">{inscrito.observacoes}</p>
            ) : null}

            {showStatusActions && onStatusChange ? (
              <select
                value={inscrito.status ?? "pendente"}
                onChange={(evento) => onStatusChange(inscrito.id, evento.target.value)}
                aria-label={`Alterar status de ${inscrito.nome_completo}`}
                className="mt-3 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[12px] text-arena-ink outline-none focus:border-arena-red"
              >
                <option value="pendente">Pendente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            ) : null}
          </article>
        ))}
      </div>
    </>
  );
}