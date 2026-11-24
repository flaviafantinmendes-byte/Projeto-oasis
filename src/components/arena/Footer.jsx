import { Link } from "@tanstack/react-router";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Plataforma",
    links: [
      { label: "Início", to: "/inicio" },
      { label: "Modalidades", to: "/modalidades" },
      { label: "Contato", to: "/contato" },
    ],
  },
  {
    title: "Acesso",
    links: [
      { label: "Entrar", to: "/login" },
      { label: "Criar conta", to: "/cadastro" },
      { label: "Meu painel", to: "/competidor" },
    ],
  },
  {
    title: "Inscrições",
    links: [
      { label: "Ficha de última hora", to: "/nova-inscricao" },
      { label: "Regulamento", to: "/modalidades" },
      { label: "Falar com a organização", to: "/contato" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#A8000C] text-white">
      <div className="absolute -left-24 top-0 h-full w-40 -skew-x-12 bg-arena-orange/25" />
      <div className="arena-container relative pb-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              Sistema de inscrição e gestão de competições da Oásis Eventos. Jiu-Jitsu, Taekwondo,
              Música e Dança.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="arena-overline text-[10px] text-arena-yellow">{column.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-white/60 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Oásis Eventos. Todos os direitos reservados.</p>
          <Link to="/contato" className="transition-colors hover:text-white">
            Privacidade e uso de dados
          </Link>
        </div>

        <div className="pointer-events-none mt-12 select-none overflow-hidden">
          <span className="block translate-y-[26%] font-display text-[19vw] font-bold leading-none tracking-[-0.05em] text-white/[0.045]">
            OÁSIS
          </span>
        </div>
      </div>
    </footer>
  );
}