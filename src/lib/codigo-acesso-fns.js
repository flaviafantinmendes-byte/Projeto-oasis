import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { solicitarCodigo } from "@/lib/codigo-acesso";

const linhas = (resultado) => (Array.isArray(resultado) ? resultado : resultado?.items ?? []);

// A conta é procurada no servidor (service role): o cliente nunca decide se o e-mail existe.
async function buscarPorEmail(servico, email) {
  const exatos = linhas(await servico.entities.User.filter({ email }));
  if (exatos.length) return exatos[0];
  // E-mail gravado com maiúsculas/espaços: compara sem diferenciar caixa.
  const todos = linhas(await servico.entities.User.list());
  return todos.find((usuario) => (usuario.email ?? "").toLowerCase() === email) ?? null;
}

/**
 * Recebe o e-mail digitado, confere se a conta existe e só então dispara o e-mail
 * da plataforma para o endereço digitado:
 * - conta em processo de cadastro -> código de 6 dígitos (resendOtp)
 * - conta já verificada          -> link de acesso (resetPasswordRequest)
 * - conta inexistente            -> { status: "nao_encontrada", mensagem: "conta nao encontrada" }
 */
export const solicitarCodigoAcesso = createServerFn({ method: "POST" })
  .validator((input) => z.object({ email: z.string().min(3).max(160) }).parse(input))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const servico = base44.asServiceRole;

    return solicitarCodigo({
      email: data.email,
      buscarUsuario: (email) => buscarPorEmail(servico, email),
      enviarCodigo: (email) => base44.auth.resendOtp(email),
      enviarAcesso: (email) => base44.auth.resetPasswordRequest(email),
      registrarErro: (etapa, erro) => {
        console.error(`[codigo-acesso] falha em ${etapa}: ${erro?.message ?? erro}`);
      },
    });
  });