import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, MapPin, MessageSquare } from "lucide-react";
import PageHero from "@/components/arena/PageHero";
import { base44 } from "@/api/base44Client";

export const Route = createFileRoute("/_site/contato")({
  head: () => ({
    meta: [
      { title: "Contato | Oásis Eventos" },
      { name: "description", content: "Fale com a equipe da Oásis Eventos: dúvidas sobre inscrições, eventos e organização." },
    ],
  }),
  component: ContatoPage,
});

const EMPTY = { nome: "", email: "", assunto: "Dúvida sobre inscrição", mensagem: "" };

function ContatoPage() {
  const [values, setValues] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const submit = async (formEvent) => {
    formEvent.preventDefault();
    setError("");
    if (!values.nome.trim() || !values.email.trim() || !values.mensagem.trim()) {
      setError("Preencha nome, e-mail e mensagem para enviar.");
      return;
    }
    setSending(true);
    try {
      await base44.entities.MensagemContato.create({ ...values, status: "novo" });
      setSent(true);
      setValues(EMPTY);
      toast.success("Mensagem enviada! Responderemos em breve.");
    } catch (submitError) {
      setError("Não foi possível enviar sua mensagem agora. Tente novamente em instantes.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Fale com a gente"
        title="Contato"
        description="Dúvidas sobre inscrições, eventos ou organização de competições? Nossa equipe responde em até dois dias úteis."
      />

      <section className="bg-white py-12 md:py-16">
        <div className="arena-container grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <ContactCard icon={Mail} label="E-mail" value="contato@arenaesportiva.com.br" />
            <ContactCard icon={MessageSquare} label="Organizadores" value="organizadores@arenaesportiva.com.br" />
            <ContactCard icon={MapPin} label="Sede" value="São Paulo · SP" />
            <div className="rounded-2xl border border-black/[0.07] bg-arena-mist/50 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-arena-gray">Atendimento</p>
              <p className="mt-2 text-[13px] leading-relaxed text-arena-ink">
                Segunda a sexta, das 9h às 18h (horário de Brasília).
              </p>
            </div>
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-black/[0.07] bg-white p-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-arena-red" />
              <h2 className="mt-4 font-display text-xl font-bold uppercase text-arena-ink">Mensagem enviada</h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-arena-gray">
                Recebemos seu contato. Nossa equipe responde no e-mail informado.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 rounded-full border border-black/10 px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.1em] text-arena-ink"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-2xl border border-black/[0.07] bg-white p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome" value={values.nome} onChange={update("nome")} placeholder="Seu nome" />
                <Field label="E-mail" value={values.email} onChange={update("email")} placeholder="voce@email.com" />
              </div>
              <label className="mt-4 block">
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-arena-gray">Assunto</span>
                <select
                  value={values.assunto}
                  onChange={update("assunto")}
                  className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-arena-ink outline-none focus:border-arena-red"
                >
                  <option>Dúvida sobre inscrição</option>
                  <option>Problema com pagamento</option>
                  <option>Quero organizar uma competição</option>
                  <option>Parceria ou patrocínio</option>
                  <option>Outro assunto</option>
                </select>
              </label>
              <label className="mt-4 block">
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-arena-gray">Mensagem</span>
                <textarea
                  value={values.mensagem}
                  onChange={update("mensagem")}
                  rows={5}
                  placeholder="Como podemos ajudar?"
                  className="mt-1.5 w-full resize-none rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-arena-ink outline-none focus:border-arena-red"
                />
              </label>

              {error ? (
                <p className="mt-4 rounded-xl bg-arena-red/10 px-3.5 py-2.5 text-[12.5px] text-arena-red">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={sending}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-arena-red px-6 py-3.5 font-display text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-arena-orange disabled:opacity-60"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Enviar mensagem
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-arena-gray">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-arena-ink outline-none focus:border-arena-red"
      />
    </label>
  );
}

function ContactCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-black/[0.07] bg-white p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-arena-red/10 text-arena-red">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-arena-gray">{label}</p>
        <p className="mt-1 text-[13.5px] font-semibold text-arena-ink">{value}</p>
      </div>
    </div>
  );
}