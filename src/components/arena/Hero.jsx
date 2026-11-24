import { Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import { ARENA_IMAGES } from "@/lib/arena-images";

const STATS = [
  { value: "4", label: "Modalidades" },
  { value: "6", label: "Categorias de idade" },
  { value: "3", label: "Perfis de acesso" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-arena-red">
      <Image
        src={ARENA_IMAGES.hero}
        alt="Atletas de jiu-jitsu e taekwondo em ação em uma arena"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#A8000C]/95 via-arena-red/85 to-arena-orange/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#8A000A]/85 via-arena-red/10 to-arena-orange/50" />
      <div className="absolute inset-y-0 left-[46%] hidden w-28 -skew-x-12 bg-gradient-to-b from-arena-yellow/50 via-arena-orange/20 to-transparent lg:block" />
      <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-arena-yellow/30 blur-[120px]" />

      <div className="arena-container relative pb-16 pt-16 md:pb-20 md:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-arena-yellow/40 bg-arena-yellow/10 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.24em] text-arena-yellow">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-arena-yellow" />
          Temporada 2026 · Inscrições abertas
        </p>

        <h1 className="mt-6 font-script text-[54px] leading-[1.06] text-white sm:text-[70px] lg:text-[86px] xl:text-[100px]">
          <span className="block">Oásis</span>
          <span className="block bg-gradient-to-r from-arena-red via-arena-orange to-arena-yellow bg-clip-text pb-3 text-transparent">
            desenvolvendo pessoas
          </span>
        </h1>

        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10.5px] font-bold uppercase tracking-[0.26em] text-white/60">
          <span>Jiu-Jitsu</span>
          <span className="h-1 w-1 rounded-full bg-arena-red" />
          <span>Taekwondo</span>
          <span className="h-1 w-1 rounded-full bg-arena-red" />
          <span>Música</span>
          <span className="h-1 w-1 rounded-full bg-arena-red" />
          <span>Dança</span>
        </p>

        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-base">
          Sistema oficial de inscrições da Oásis Eventos: fichas completas, categorias calculadas
          automaticamente e acompanhamento por perfil de acesso.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/cadastro"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-arena-yellow px-7 py-4 font-display text-[13px] font-bold uppercase tracking-[0.12em] text-arena-ink transition-all duration-300 hover:bg-white hover:shadow-[0_18px_40px_-20px_rgba(255,196,0,0.9)]"
          >
            Fazer minha inscrição
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/modalidades"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 px-7 py-4 font-display text-[13px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Ver modalidades
          </Link>
        </div>

        <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-7">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{stat.label}</dt>
              <dd className="mt-1.5 font-display text-2xl font-bold text-white md:text-[28px]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}