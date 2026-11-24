import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { modalityImage } from "@/lib/arena-images";
import { isLuta } from "@/lib/categorias";
import SectionHeading from "./SectionHeading";

export default function ModalitiesSection({ modalidades = [] }) {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="arena-container">
        <SectionHeading
          eyebrow="4 modalidades"
          title="Modalidades oficiais"
          description="Jiu-Jitsu e Taekwondo com divisão por peso, idade e sexo. Música e Dança com divisão por idade e sexo."
          action={
            <Link
              to="/modalidades"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 font-display text-[11.5px] font-bold uppercase tracking-[0.12em] text-arena-ink transition-colors hover:border-arena-ink/30 hover:bg-arena-mist"
            >
              Ver regulamento
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4">
          {modalidades.map((modalidade) => (
            <Link
              key={modalidade.slug || modalidade.id}
              to="/modalidades"
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-arena-red"
            >
              <Image
                src={modalidade.imagem_url || modalityImage(modalidade.nome)}
                alt={modalidade.nome}
                className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7A0009]/95 via-[#A8000C]/55 to-transparent" />
              <div className="absolute inset-0 bg-arena-red/0 transition-colors duration-500 group-hover:bg-arena-red/25" />
              <div className="absolute inset-x-4 bottom-4">
                <p className="font-display text-[17px] font-bold uppercase leading-tight text-white">
                  {modalidade.nome}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-white/60">{modalidade.descricao}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-arena-yellow">
                  {isLuta(modalidade.nome) ? "Peso · Idade · Sexo" : "Idade · Sexo"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}