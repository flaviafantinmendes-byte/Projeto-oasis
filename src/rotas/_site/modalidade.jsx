import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Scale, Users } from "lucide-react";
import PageHero from "@/components/arena/PageHero";
import { Image } from "@/components/ui/image";
import { listModalidadesOficiais } from "@/lib/arena-api";
import { modalityImage } from "@/lib/arena-images";
import { CATEGORIAS_IDADE, DIVISOES_PESO, isLuta, modalidadeInfo } from "@/lib/categorias";
import { useAsync } from "@/hooks/useAsync";

export const Route = createFileRoute("/_site/modalidades")({
  head: () => ({
    meta: [
    { title: "Modalidades e categorias | Oásis Eventos" },
    {
      name: "description",
      content:
      "Jiu-Jitsu e Taekwondo com divisão por peso, idade e sexo; Música e Dança por idade e sexo. Categorias etárias calculadas automaticamente."
    }]

  }),
  component: ModalidadesPage
});

function ModalidadesPage() {
  const { data } = useAsync(() => listModalidadesOficiais(), []);
  const modalidades = data ?? [];

  return (
    <>
      <PageHero
        eyebrow="Regulamento"
        title="Modalidades e categorias"
        description="Quatro modalidades oficiais. Nas lutas a divisão é por peso, idade e sexo; em Música e Dança, por idade e sexo. A categoria etária é calculada pela data de nascimento." />
      

      <section className="bg-white py-12 md:py-16">
        <div className="arena-container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {modalidades.map((modalidade) => {
              const luta = isLuta(modalidade.nome);
              const info = modalidadeInfo(modalidade.nome);
              const divisoes = luta ? DIVISOES_PESO[info?.slug]?.Masculino ?? [] : [];
              return (
                <article key={modalidade.slug || modalidade.id} className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
                  <div className="relative aspect-[4/3] bg-arena-red">
                    <Image
                      src={modalidade.imagem_url || modalityImage(modalidade.nome)}
                      alt={modalidade.nome}
                      className="absolute inset-0 h-full w-full" />
                    
                    
                    <p className="absolute inset-x-4 bottom-3 font-display text-[17px] font-bold uppercase text-white">
                      {modalidade.nome}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-arena-red">
                      {luta ? <Scale className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                      {luta ? "Peso · Idade · Sexo" : "Idade · Sexo"}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-arena-gray">{modalidade.descricao}</p>
                    {luta ?
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                        {divisoes.map((divisao) =>
                      <li
                        key={divisao.label}
                        className="rounded-full bg-arena-mist px-2.5 py-1 text-[10.5px] font-semibold text-arena-ink/70">
                        
                            {divisao.label}
                          </li>
                      )}
                      </ul> :

                    <p className="mt-3 text-[11.5px] leading-relaxed text-arena-gray">
                        Sem pesagem: a chave é montada por categoria etária e sexo.
                      </p>
                    }
                  </div>
                </article>);

            })}
          </div>

          <div className="mt-12 rounded-2xl border border-black/[0.07] bg-arena-mist/60 p-6 md:p-8">
            <h2 className="font-display text-lg font-bold uppercase text-arena-ink">Categorias etárias</h2>
            <p className="mt-1.5 text-[12.5px] text-arena-gray">
              Calculadas automaticamente a partir da data de nascimento informada na ficha.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CATEGORIAS_IDADE.map((categoria) =>
              <div key={categoria.slug} className="rounded-xl border border-black/[0.06] bg-white p-3.5">
                  <p className="font-display text-[13px] font-bold uppercase text-arena-ink">{categoria.label}</p>
                  <p className="mt-1 text-[11.5px] text-arena-gray">
                    {categoria.max >= 200 ? `${categoria.min}+ anos` : `${categoria.min} a ${categoria.max} anos`}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              to="/cadastro"
              className="group inline-flex items-center gap-2 rounded-full bg-arena-red px-6 py-3.5 font-display text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-arena-orange">
              
              Criar minha conta
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3.5 font-display text-[12px] font-bold uppercase tracking-[0.12em] text-arena-ink transition-colors hover:bg-arena-mist">
              
              Falar com a organização
            </Link>
          </div>
        </div>
      </section>
    </>);

}