// Perfis de acesso e permissões. Cada nível tem menos privilégios que o anterior:
// Administrador (tudo) > Professor (fichas) > Competidor (apenas os próprios dados).

export const PERFIS = {
  administrador: {
    label: "Administrador",
    descricao: "Acesso total: painel, todas as fichas e gestão de perfis.",
  },
  professor: {
    label: "Professor",
    descricao: "Cria fichas de última hora e acompanha as fichas que enviou.",
  },
  competidor: {
    label: "Competidor",
    descricao: "Consulta apenas as próprias inscrições.",
  },
};

export const PERMISSOES = {
  administrador: { verTodosInscritos: true, criarFicha: true, alterarStatus: true, gerenciarPerfis: true },
  professor: { verTodosInscritos: false, criarFicha: true, alterarStatus: false, gerenciarPerfis: false },
  competidor: { verTodosInscritos: false, criarFicha: false, alterarStatus: false, gerenciarPerfis: false },
};

export const PAINEL_DO_PERFIL = {
  administrador: "/admin",
  professor: "/professor",
  competidor: "/competidor",
};

export function perfilEfetivo(user) {
  if (!user) return null;
  if (user.role === "admin") return "administrador";
  return PERFIS[user.perfil] ? user.perfil : "competidor";
}

export function perfilLabel(user) {
  const perfil = perfilEfetivo(user);
  return perfil ? PERFIS[perfil].label : "";
}

export function pode(user, acao) {
  const perfil = perfilEfetivo(user);
  return Boolean(perfil && PERMISSOES[perfil]?.[acao]);
}

export function painelDoPerfil(user) {
  const perfil = perfilEfetivo(user);
  return PAINEL_DO_PERFIL[perfil] ?? "/competidor";
}