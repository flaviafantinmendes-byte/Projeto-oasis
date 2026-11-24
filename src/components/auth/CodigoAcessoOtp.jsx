import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { AuthError, SubmitButton } from "@/components/auth/parts";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { STATUS } from "@/lib/codigo-acesso";
import { solicitarCodigoAcesso } from "@/lib/codigo-acesso-fns";
import { PAINEL_DO_PERFIL } from "@/lib/perfis";

// Segundo passo do acesso por código: o código chega no e-mail digitado e é
// validado pelo mesmo mecanismo da plataforma usado no cadastro (verifyOtp).
export function CodigoAcessoOtp({ email, perfil, returnTo, onMfaChallenge, onVoltar }) {
  const solicitar = useServerFn(solicitarCodigoAcesso);
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);

  async function verificar(e) {
    e.preventDefault();
    if (codigo.length < 6) return;
    setErro("");
    setBusy(true);
    try {
      const resultado = await base44.auth.verifyOtp({ email, otpCode: codigo });
      if (resultado?.mfa_required) {
        onMfaChallenge(resultado);
        return;
      }
      if (resultado?.access_token) base44.auth.setToken(resultado.access_token);
      // Redirecionamento duro: o app reinicia com a nova sessão.
      window.location.href = returnTo && returnTo !== "/" ? returnTo : PAINEL_DO_PERFIL[perfil] ?? "/";
    } catch (err) {
      setErro(err.message || "Código de verificação inválido");
      setBusy(false);
    }
  }

  async function reenviar() {
    setErro("");
    try {
      const resposta = await solicitar({ data: { email } });
      if (resposta.status === STATUS.CODIGO_ENVIADO) {
        toast("Código enviado", { description: "Confira seu e-mail para ver o novo código." });
      } else {
        setErro(resposta.mensagem);
      }
    } catch {
      setErro("Não foi possível enviar o e-mail agora. Tente novamente em alguns instantes.");
    }
  }

  return (
    <form onSubmit={verificar}>
      <p className="mb-4 text-sm text-muted-foreground">
        Enviamos um código de 6 dígitos para <span className="font-medium text-foreground">{email}</span>.
      </p>
      <AuthError>{erro}</AuthError>
      <div className="mb-6 flex justify-center">
        <InputOTP maxLength={6} value={codigo} onChange={setCodigo} autoFocus autoComplete="one-time-code">
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <SubmitButton busy={busy} busyLabel="Verificando..." disabled={busy || codigo.length < 6}>
        Entrar
      </SubmitButton>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Não recebeu o código?{" "}
        <button type="button" onClick={reenviar} className="font-medium text-primary hover:underline">
          Reenviar
        </button>
      </p>
      <button type="button" onClick={onVoltar} className="mt-2 w-full text-center text-sm text-muted-foreground hover:text-foreground">
        Entrar com senha
      </button>
    </form>
  );
}