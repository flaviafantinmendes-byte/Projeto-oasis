import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Mail } from "lucide-react";
import { AuthError, SubmitButton } from "@/components/auth/parts";
import { CodigoAcessoOtp } from "@/components/auth/CodigoAcessoOtp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STATUS } from "@/lib/codigo-acesso";
import { solicitarCodigoAcesso } from "@/lib/codigo-acesso-fns";

/**
 * "Entrar com código por e-mail": pede o e-mail, o servidor confere se a conta
 * existe e só então envia. Conta inexistente mostra "conta nao encontrada".
 */
export function CodigoAcessoForm({ perfil, returnTo, onMfaChallenge, onVoltar }) {
  const solicitar = useServerFn(solicitarCodigoAcesso);
  const [email, setEmail] = useState("");
  const [etapa, setEtapa] = useState("email");
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setBusy(true);
    try {
      const resposta = await solicitar({ data: { email } });
      if (resposta.status === STATUS.CODIGO_ENVIADO) setEtapa("codigo");
      else if (resposta.status === STATUS.ACESSO_ENVIADO) setEtapa("acesso");
      else setErro(resposta.mensagem);
    } catch {
      setErro("Não foi possível enviar o e-mail agora. Tente novamente em alguns instantes.");
    } finally {
      setBusy(false);
    }
  }

  if (etapa === "codigo") {
    return <CodigoAcessoOtp email={email} perfil={perfil} returnTo={returnTo} onMfaChallenge={onMfaChallenge} onVoltar={onVoltar} />;
  }

  if (etapa === "acesso") {
    return (
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          Sua conta já está verificada. Enviamos um link de acesso para{" "}
          <span className="font-medium text-foreground">{email}</span> — abra o e-mail para definir uma nova senha e entrar.
        </p>
        <button type="button" onClick={onVoltar} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar para a senha
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Digite seu e-mail: enviamos um código de acesso para o endereço informado.
      </p>
      <AuthError>{erro}</AuthError>
      <div className="space-y-2">
        <Label htmlFor="codigo-email">E-mail</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="codigo-email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 pl-10"
            disabled={busy}
            required
          />
        </div>
      </div>
      <SubmitButton busy={busy} busyLabel="Enviando...">
        Enviar código
      </SubmitButton>
      <button
        type="button"
        onClick={onVoltar}
        className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Entrar com senha
      </button>
    </form>
  );
}