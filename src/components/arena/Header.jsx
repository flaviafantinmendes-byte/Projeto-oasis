import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import { painelDoPerfil, perfilLabel } from "@/lib/perfis";
import Logo from "./Logo";

const NAV = [
  { label: "Início", to: "/inicio" },
  { label: "Modalidades", to: "/modalidades" },
  { label: "Contato", to: "/contato" },
];

const navLink =
  "rounded-full px-3 py-2 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-arena-ink/65 transition-colors hover:bg-arena-mist hover:text-arena-ink data-[status=active]:bg-arena-red/[0.07] data-[status=active]:text-arena-red";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isLoadingAuth } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/95 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-[0_14px_40px_-32px_rgba(18,18,18,0.6)]",
      )}
    >
      <div className="arena-container flex h-[74px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className={navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!isLoadingAuth && user ? (
            <>
              <Link
                to={painelDoPerfil(user)}
                className="hidden items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-arena-ink transition-colors hover:border-arena-ink/30 sm:flex"
              >
                <LayoutDashboard className="h-4 w-4" /> {perfilLabel(user) || "Painel"}
              </Link>
              <button
                type="button"
                onClick={() => base44.auth.logout()}
                aria-label="Sair da conta"
                className="hidden h-10 w-10 place-items-center rounded-full text-arena-ink/60 transition-colors hover:bg-arena-mist hover:text-arena-red sm:grid"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-3 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-arena-ink/70 transition-colors hover:text-arena-red sm:block"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="relative hidden overflow-hidden rounded-full bg-arena-red px-5 py-3 text-[12.5px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-arena-orange sm:block"
              >
                <span className="relative z-10">Cadastrar</span>
                <span className="absolute inset-y-0 -left-10 w-8 animate-shimmer bg-white/25 blur-[6px]" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-arena-ink transition-colors hover:bg-arena-mist md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-black/5 bg-white transition-[max-height,opacity] duration-500 ease-out md:hidden",
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="arena-container space-y-4 py-5">
          <nav className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.06em] text-arena-ink/75 data-[status=active]:bg-arena-red/[0.07] data-[status=active]:text-arena-red"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={user ? painelDoPerfil(user) : "/login"}
              onClick={() => setOpen(false)}
              className="rounded-full border border-black/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-arena-ink"
            >
              {user ? "Meu painel" : "Entrar"}
            </Link>
            <Link
              to="/cadastro"
              onClick={() => setOpen(false)}
              className="rounded-full bg-arena-yellow px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-arena-ink"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}