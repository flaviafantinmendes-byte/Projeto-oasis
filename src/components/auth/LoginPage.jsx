import { GraduationCap, Lock, LogIn, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { CodigoAcessoForm } from "@/components/auth/CodigoAcessoForm";
import { AuthError, AuthLink, GoogleButton, OrDivider, SubmitButton } from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MfaFlow } from "@/components/auth/MfaFlow";
import { MfaScreen } from "@/components/auth/MfaParts";
import { loginWithMfa } from "@/lib/authMfa";
import { safeReturnTo } from "@/lib/authReturnTo";
import { PAINEL_DO_PERFIL } from "@/lib/perfis";

// Perfis exibidos na entrada do site: Competidor primeiro, depois Professor e Administrador.
const PERFIS_LOGIN = [
  { valor: "competidor", titulo: "Competidor", descricao: "Acompanho minhas inscrições", icone: User },
  { valor: "professor", titulo: "Professor", descricao: "Crio fichas de última hora", icone: GraduationCap },
  { valor: "administrador", titulo: "Administrador", descricao: "Acesso total ao sistema", icone: ShieldCheck },
];

// The /login page. ?returnTo= (or the platform's ?from_url=) is where the visitor
// goes after signing in — the login gate and the MCP consent page send people here with it.
export function LoginPage() {
  const returnTo = safeReturnTo();
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("competidor");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState(null);
  const [modo, setModo] = useState("senha");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await loginWithMfa(email, password);
      if (result.mfa_required) {
        setMfaChallenge(result);
        return;
      }
      // A hard redirect: the app re-initializes with the new session.
      const destino = returnTo && returnTo !== "/" ? returnTo : PAINEL_DO_PERFIL[perfil];
      window.location.href = destino;
    } catch (err) {
      setError(err.message || "E-mail ou senha inválidos");
      setBusy(false);
    }
  }

  // The second sign-in step (authenticator app or text message) replaces the whole page.
  if (mfaChallenge) return <MfaScreen><MfaFlow challenge={mfaChallenge} returnTo={returnTo} /></MfaScreen>;

  return (
    <AuthLayout icon={LogIn} title="Bem-vindo de volta" subtitle="Entre na sua conta da Oásis Eventos">
      <AuthError>{error}</AuthError>

      <div className="mb-5 space-y-2">
        <Label>Entrar como</Label>
        <div className="space-y-2">
          {PERFIS_LOGIN.map((opcao) => {
            const Icone = opcao.icone;
            const ativo = perfil === opcao.valor;
            return (
              <button
                key={opcao.valor}
                type="button"
                onClick={() => setPerfil(opcao.valor)}
                aria-pressed={ativo}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                  ativo ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <Icone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="block text-[13px] font-semibold text-foreground">{opcao.titulo}</span>
                  <span className="block text-[11px] text-muted-foreground">{opcao.descricao}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {modo === "codigo" ? (
        <CodigoAcessoForm
          perfil={perfil}
          returnTo={returnTo}
          onMfaChallenge={setMfaChallenge}
          onVoltar={() => setModo("senha")}
        />
      ) : (
        <>
      <GoogleButton returnTo={returnTo} onError={setError} />
      <OrDivider />
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="login-email" type="email" autoComplete="email" autoFocus placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-10" required />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Senha</Label>
            <AuthLink to="/forgot-password" returnTo={returnTo} className="text-xs text-primary hover:underline">
              Esqueceu a senha?
            </AuthLink>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="login-password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-10" required />
          </div>
        </div>
        <SubmitButton busy={busy} busyLabel="Entrando...">
          Entrar
        </SubmitButton>
      </form>
      <button
        type="button"
        onClick={() => setModo("codigo")}
        className="mt-4 w-full text-center text-sm font-medium text-primary hover:underline"
      >
        Entrar com código por e-mail
      </button>
        </>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <AuthLink to="/cadastro" returnTo={returnTo}>
          Cadastre-se
        </AuthLink>
      </p>
    </AuthLayout>
  );
}