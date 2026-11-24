import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTA_NAO_ENCONTRADA, STATUS, solicitarCodigo } from "../src/lib/codigo-acesso.js";

function cenario({ usuario = null, falhaBusca = false, falhaEnvio = false } = {}) {
  const enviados = { codigo: [], acesso: [] };
  const erros = [];
  const chamadas = {
    buscarUsuario: async (email) => {
      if (falhaBusca) throw new Error("banco fora do ar");
      chamadas.emailsBuscados.push(email);
      return usuario;
    },
    enviarCodigo: async (email) => {
      if (falhaEnvio) throw new Error("smtp recusou");
      enviados.codigo.push(email);
    },
    enviarAcesso: async (email) => {
      if (falhaEnvio) throw new Error("smtp recusou");
      enviados.acesso.push(email);
    },
    registrarErro: (etapa, erro) => erros.push({ etapa, mensagem: erro.message }),
    emailsBuscados: [],
  };
  return { chamadas, enviados, erros };
}

test("conta em processo de cadastro recebe o código no endereço digitado", async () => {
  const { chamadas, enviados, erros } = cenario({ usuario: { email: "atleta@oasis.com", is_verified: false } });
  const resposta = await solicitarCodigo({ email: " Atleta@Oasis.com ", ...chamadas });

  assert.equal(resposta.status, STATUS.CODIGO_ENVIADO);
  assert.deepEqual(enviados.codigo, ["atleta@oasis.com"]);
  assert.deepEqual(enviados.acesso, []);
  assert.deepEqual(chamadas.emailsBuscados, ["atleta@oasis.com"]);
  assert.deepEqual(erros, []);
});

test("conta já verificada recebe o link de acesso no endereço digitado", async () => {
  const { chamadas, enviados } = cenario({ usuario: { email: "prof@oasis.com", is_verified: true } });
  const resposta = await solicitarCodigo({ email: "prof@oasis.com", ...chamadas });

  assert.equal(resposta.status, STATUS.ACESSO_ENVIADO);
  assert.deepEqual(enviados.acesso, ["prof@oasis.com"]);
  assert.deepEqual(enviados.codigo, []);
});

test("conta inexistente recebe 'conta nao encontrada' e nenhum e-mail é enviado", async () => {
  const { chamadas, enviados } = cenario({ usuario: null });
  const resposta = await solicitarCodigo({ email: "ninguem@oasis.com", ...chamadas });

  assert.equal(resposta.status, STATUS.NAO_ENCONTRADA);
  assert.equal(resposta.mensagem, CONTA_NAO_ENCONTRADA);
  assert.equal(resposta.mensagem, "conta nao encontrada");
  assert.deepEqual(enviados.codigo, []);
  assert.deepEqual(enviados.acesso, []);
});

test("falha no serviço de e-mail é tratada, registrada e devolve resposta à pessoa", async () => {
  const { chamadas, enviados, erros } = cenario({
    usuario: { email: "atleta@oasis.com", is_verified: false },
    falhaEnvio: true,
  });
  const resposta = await solicitarCodigo({ email: "atleta@oasis.com", ...chamadas });

  assert.equal(resposta.status, STATUS.FALHA_ENVIO);
  assert.match(resposta.mensagem, /Não foi possível enviar/);
  assert.equal(erros.length, 1);
  assert.equal(erros[0].etapa, "envio");
  assert.deepEqual(enviados.codigo, []);
});

test("falha ao consultar a conta não derruba o fluxo e é registrada", async () => {
  const { chamadas, erros } = cenario({ falhaBusca: true });
  const resposta = await solicitarCodigo({ email: "atleta@oasis.com", ...chamadas });

  assert.equal(resposta.status, STATUS.FALHA_ENVIO);
  assert.equal(erros[0].etapa, "busca");
});

test("e-mail fora de formato não dispara envio", async () => {
  const { chamadas, enviados } = cenario({ usuario: { email: "atleta@oasis.com", is_verified: false } });
  const resposta = await solicitarCodigo({ email: "sem-arroba", ...chamadas });

  assert.equal(resposta.status, STATUS.EMAIL_INVALIDO);
  assert.deepEqual(enviados.codigo, []);
  assert.deepEqual(enviados.acesso, []);
});