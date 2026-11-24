import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export default function JoinBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-arena-red via-[#F02B00] to-arena-orange py-16 md:py-20">
      <div className="absolute inset-y-0 -left-10 w-40 -skew-x-12 bg-white/10" />
      <div className="absolute inset-y-0 left-24 w-2 -skew-x-12 bg-arena-yellow/70" />
      <div className="absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rotate-12 bg-arena-yellow/20 blur-2xl" />
      <div className="arena-container relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="arena-overline text-arena-ink/70">Inscrições abertas</p>
          <h2 className="mt-3 font-display text-[30px] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-white sm:text-[40px] lg:text-[48px]">
            A próxima conquista começa aqui.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-[15px]">
            Crie sua conta como competidor ou professor e acompanhe cada inscrição em um só lugar.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            to="/cadastro"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-arena-yellow px-7 py-4 font-display text-[12.5px] font-bold uppercase tracking-[0.12em] text-arena-ink shadow-[0_20px_44px_-24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:bg-white"
          >
            Criar minha conta
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-display text-[12.5px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/70 hover:bg-white/10"
          >
            Entrar
          </Link>
        </div>
      </div>
    </section>
  );
}