// Regra de negócio do envio do código de acesso (login/cadastro).
// Só envia para quem tem conta; quem não tem recebe exatamente "conta nao encontrada".
// Módulo puro (sem imports de servidor) para poder ser testado: tests/codigo-acesso.test.mjs

export const CONTA_NAO_ENCONTRADA = "conta nao encontrada";
export const EMAIL_INVALIDO = "Informe um e-mail válido";
export const FALHA_NO_ENVIO = "Não foi possível enviar o e-mail agora. Tente novamente em alguns instantes.";

export const STATUS = {
  EMAIL_INVALIDO: "email_invalido",
  NAO_ENCONTRADA: "nao_encontrada",
  CODIGO_ENVIADO: "codigo_enviado",
  ACESSO_ENVIADO: "acesso_enviado",
  FALHA_ENVIO: "falha_envio",
};

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizarEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

/**
 * Decide e executa o envio do código.
 * buscarUsuario(email)  -> usuário da conta (ou null)
 * enviarCodigo(email)   -> código de verificação de 6 dígitos (conta em processo de cadastro)
 * enviarAcesso(email)   -> link de acesso (conta já verificada)
 * Nunca lança: quem chama sempre recebe uma resposta para mostrar à pessoa.
 */
export async function solicitarCodigo({
  email,
  buscarUsuario,
  enviarCodigo,
  enviarAcesso,
  registrarErro = () => {},
}) {
  const normalizado = normalizarEmail(email);
  if (!FORMATO_EMAIL.test(normalizado)) {
    return { status: STATUS.EMAIL_INVALIDO, mensagem: EMAIL_INVALIDO };
  }

  let usuario;
  try {
    usuario = await buscarUsuario(normalizado);
  } catch (erro) {
    registrarErro("busca", erro);
    return { status: STATUS.FALHA_ENVIO, mensagem: FALHA_NO_ENVIO };
  }

  // Sem conta: nenhum e-mail é disparado.
  if (!usuario) {
    return { status: STATUS.NAO_ENCONTRADA, mensagem: CONTA_NAO_ENCONTRADA };
  }

  const verificado = Boolean(usuario.is_verified);
  try {
    await (verificado ? enviarAcesso(normalizado) : enviarCodigo(normalizado));
  } catch (erro) {
    registrarErro("envio", erro);
    return { status: STATUS.FALHA_ENVIO, mensagem: FALHA_NO_ENVIO };
  }

  return verificado
    ? { status: STATUS.ACESSO_ENVIADO, email: normalizado }
    : { status: STATUS.CODIGO_ENVIADO, email: normalizado };
}