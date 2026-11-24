import { Users } from "lucide-react";
import { MODALIDADES } from "@/lib/categorias";

export default function StatsInscritos({ total = 0, porModalidade = {}, loading = false }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_2.9fr]">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-arena-red to-arena-orange p-6 text-white">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-arena-yellow/40 blur-2xl" />
        <p className="arena-overline text-arena-yellow">Total de inscritos</p>
        <p className="mt-3 font-display text-[52px] font-bold leading-none">
          {loading ? "—" : new Intl.NumberFormat("pt-BR").format(total)}
        </p>
        <p className="mt-3 flex items-center gap-2 text-[12px] text-white/55">
          <Users className="h-3.5 w-3.5" /> Pessoas inscritas nas quatro modalidades
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {MODALIDADES.map((modalidade) => {
          const quantidade = porModalidade[modalidade.nome] ?? 0;
          const percentual = total > 0 ? Math.round((quantidade / total) * 100) : 0;
          return (
            <div key={modalidade.slug} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-arena-gray">{modalidade.nome}</p>
              <p className="mt-2 font-display text-[30px] font-bold leading-none text-arena-ink">
                {loading ? "—" : new Intl.NumberFormat("pt-BR").format(quantidade)}
              </p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-arena-mist">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-arena-red to-arena-orange"
                  style={{ width: `${percentual}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-arena-gray">{percentual}% do total</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}