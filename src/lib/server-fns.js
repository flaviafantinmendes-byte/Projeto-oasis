import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { MODALIDADES, SEXOS, classificarAtleta, exigePeso } from "@/lib/categorias";
import { pode } from "@/lib/perfis";

// Regras de permissão do servidor: nunca confiar no cliente.
// administrador -> tudo | professor -> criar fichas e ver as próprias | competidor -> ver as próprias

const MODALIDADE_NOMES = MODALIDADES.map((modalidade) => modalidade.nome);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fichaSchema = z.object({
  modalidade: z.enum(MODALIDADE_NOMES),
  nome_completo: z.string().min(3).max(120),
  data_nascimento: z.string().min(10).max(10),
  sexo: z.enum(SEXOS),
  peso_kg: z.number().positive().max(300).nullish(),
  faixa: z.string().max(60).optional(),
  equipe: z.string().max(120).optional(),
  responsavel: z.string().max(120).optional(),
  telefone: z.string().min(8).max(30),
  email: z.string().max(160).regex(EMAIL),
  cidade: z.string().max(120).optional(),
  observacoes: z.string().max(600).optional(),
});

const painelVazio = {
  autorizado: false,
  total: 0,
  porModalidade: Object.fromEntries(MODALIDADE_NOMES.map((nome) => [nome, 0])),
  inscritos: [],
};

// Painel do administrador: totais gerais, por modalidade e a lista completa.
export const obterPainelAdmin = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    if (!pode(context.user, "verTodosInscritos")) return painelVazio;

    const servico = context.getBase44().asServiceRole;
    // Somente fichas do modelo atual (as antigas, de outra estrutura, ficam fora).
    const valido = { nome_completo: { $exists: true } };
    const [total, ...porModalidade] = await Promise.all([
      servico.entities.Inscricao.count(valido),
      ...MODALIDADE_NOMES.map((nome) => servico.entities.Inscricao.count({ ...valido, modalidade: nome })),
    ]);
    const pagina = await servico.entities.Inscricao.filter(valido, { sort: "-created_date", limit: 300 });

    return {
      autorizado: true,
      total,
      porModalidade: Object.fromEntries(MODALIDADE_NOMES.map((nome, indice) => [nome, porModalidade[indice]])),
      inscritos: pagina.items ?? [],
    };
  });

// Fichas criadas pelo professor (ou pelo administrador) logado.
export const listarFichasCriadasPorMim = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    if (!pode(context.user, "criarFicha")) return { autorizado: false, inscritos: [] };

    const pagina = await context
      .getBase44()
      .asServiceRole.entities.Inscricao.filter(
        { created_by_id: context.user.id, nome_completo: { $exists: true } },
        { sort: "-created_date", limit: 200 },
      );
    return { autorizado: true, inscritos: pagina.items ?? [] };
  });

// Fichas em que o competidor logado é o atleta (vinculadas pelo e-mail da inscrição).
export const listarMinhasInscricoes = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const pagina = await context
      .getBase44()
      .asServiceRole.entities.Inscricao.filter(
        { email: context.user.email, nome_completo: { $exists: true } },
        { sort: "-created_date", limit: 100 },
      );
    return { autorizado: true, inscritos: pagina.items ?? [] };
  });

// Ficha de última hora: administrador e professor.
export const criarFichaInscricao = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator((input) => fichaSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (!pode(context.user, "criarFicha")) return { autorizado: false, erro: "Seu perfil não pode criar fichas." };

    const classificacao = classificarAtleta(data);
    if (!classificacao.idade && classificacao.idade !== 0) {
      return { autorizado: true, erro: "Data de nascimento inválida." };
    }
    if (!classificacao.categoria_idade) {
      return { autorizado: true, erro: "Idade fora das categorias do regulamento (a partir de 4 anos)." };
    }
    if (exigePeso(data.modalidade) && !data.peso_kg) {
      return { autorizado: true, erro: "Informe o peso do atleta para modalidades de luta." };
    }

    const inscricao = await context.getBase44().entities.Inscricao.create({
      ...data,
      ...classificacao,
      categoria_peso: exigePeso(data.modalidade) ? classificacao.categoria_peso : null,
      peso_kg: exigePeso(data.modalidade) ? data.peso_kg : null,
      faixa: exigePeso(data.modalidade) ? data.faixa || "" : "",
      status: "pendente",
    });

    return { autorizado: true, inscricao };
  });

export const atualizarStatusInscricao = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator((input) => z.object({ id: z.string(), status: z.enum(["pendente", "confirmada", "cancelada"]) }).parse(input))
  .handler(async ({ data, context }) => {
    if (!pode(context.user, "alterarStatus")) return { autorizado: false };
    const inscricao = await context.getBase44().entities.Inscricao.update(data.id, { status: data.status });
    return { autorizado: true, inscricao };
  });

// Gestão de perfis (somente administrador).
export const listarUsuarios = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    if (!pode(context.user, "gerenciarPerfis")) return { autorizado: false, usuarios: [] };

    const usuarios = await context.getBase44().asServiceRole.entities.User.list("-created_date", 200);
    return {
      autorizado: true,
      usuarios: usuarios.map((usuario) => ({
        id: usuario.id,
        full_name: usuario.full_name,
        email: usuario.email,
        role: usuario.role,
        perfil: usuario.perfil ?? null,
      })),
    };
  });

export const definirPerfilUsuario = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator((input) => z.object({ id: z.string(), perfil: z.enum(["administrador", "professor", "competidor"]) }).parse(input))
  .handler(async ({ data, context }) => {
    if (!pode(context.user, "gerenciarPerfis")) return { autorizado: false };
    const usuario = await context.getBase44().asServiceRole.entities.User.update(data.id, { perfil: data.perfil });
    return { autorizado: true, usuario: { id: usuario.id, perfil: usuario.perfil } };
  });