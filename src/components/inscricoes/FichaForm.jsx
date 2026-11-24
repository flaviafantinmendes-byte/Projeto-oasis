import { useState } from "react";
import { toast } from "sonner";
import { Calculator, Loader2, UserPlus } from "lucide-react";
import { MODALIDADES, SEXOS, classificarAtleta, exigePeso } from "@/lib/categorias";
import { criarFichaInscricao } from "@/lib/server-fns";

const VAZIO = {
  modalidade: "Jiu-Jitsu",
  nome_completo: "",
  data_nascimento: "",
  sexo: "",
  peso_kg: "",
  faixa: "",
  equipe: "",
  responsavel: "",
  telefone: "",
  email: "",
  cidade: "",
  observacoes: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const campoBase =
  "mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-arena-ink outline-none transition-colors focus:border-arena-red";

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-arena-gray">{label}</span>
      {children}
    </label>
  );
}

export default function FichaForm({ professor, onCreated }) {
  const [valores, setValores] = useState({ ...VAZIO, responsavel: professor ?? "" });
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const luta = exigePeso(valores.modalidade);
  const classificacao = classificarAtleta({
    modalidade: valores.modalidade,
    sexo: valores.sexo,
    data_nascimento: valores.data_nascimento,
    peso_kg: valores.peso_kg ? Number(valores.peso_kg) : null,
  });

  const alterar = (campo) => (evento) => setValores((anterior) => ({ ...anterior, [campo]: evento.target.value }));

  const validar = () => {
    const faltando = [];
    if (valores.nome_completo.trim().length < 3) faltando.push("nome completo");
    if (!valores.data_nascimento) faltando.push("data de nascimento");
    else if (!classificacao.categoria_idade) faltando.push("data de nascimento válida (a partir de 4 anos)");
    if (!valores.sexo) faltando.push("sexo");
    if (luta && !valores.peso_kg) faltando.push("peso");
    if (valores.telefone.trim().length < 8) faltando.push("telefone");
    if (!EMAIL.test(valores.email.trim())) faltando.push("e-mail");
    return faltando;
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setErro("");
    const faltando = validar();
    if (faltando.length) {
      setErro(`Preencha corretamente: ${faltando.join(", ")}.`);
      return;
    }

    setSalvando(true);
    try {
      const resposta = await criarFichaInscricao({
        data: {
          modalidade: valores.modalidade,
          nome_completo: valores.nome_completo.trim(),
          data_nascimento: valores.data_nascimento,
          sexo: valores.sexo,
          peso_kg: luta ? Number(valores.peso_kg) : null,
          faixa: luta ? valores.faixa.trim() : "",
          equipe: valores.equipe.trim(),
          responsavel: valores.responsavel.trim(),
          telefone: valores.telefone.trim(),
          email: valores.email.trim(),
          cidade: valores.cidade.trim(),
          observacoes: valores.observacoes.trim(),
        },
      });

      if (!resposta?.autorizado) {
        setErro("Seu perfil não tem permissão para criar fichas.");
        return;
      }
      if (resposta.erro) {
        setErro(resposta.erro);
        return;
      }

      toast.success(`Ficha de ${resposta.inscricao.nome_completo} criada.`);
      setValores({ ...VAZIO, modalidade: valores.modalidade, responsavel: valores.responsavel });
      onCreated?.(resposta.inscricao);
    } catch {
      setErro("Não foi possível salvar a ficha agora. Revise os dados e tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="rounded-2xl border border-black/[0.07] bg-white p-6">
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-arena-red" />
        <h2 className="font-display text-lg font-bold uppercase text-arena-ink">Ficha de última hora</h2>
      </div>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-arena-gray">
        A idade e a categoria são calculadas automaticamente pela data de nascimento. Para lutas, informe o peso.
      </p>

      <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
        <Campo label="Modalidade">
          <select value={valores.modalidade} onChange={alterar("modalidade")} className={campoBase}>
            {MODALIDADES.map((modalidade) => (
              <option key={modalidade.slug} value={modalidade.nome}>
                {modalidade.nome}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Nome completo">
          <input value={valores.nome_completo} onChange={alterar("nome_completo")} placeholder="Nome do competidor" className={campoBase} />
        </Campo>

        <Campo label="Data de nascimento">
          <input type="date" value={valores.data_nascimento} onChange={alterar("data_nascimento")} className={campoBase} />
        </Campo>

        <Campo label="Sexo">
          <select value={valores.sexo} onChange={alterar("sexo")} className={campoBase}>
            <option value="">Selecione</option>
            {SEXOS.map((sexo) => (
              <option key={sexo} value={sexo}>
                {sexo}
              </option>
            ))}
          </select>
        </Campo>

        {luta ? (
          <>
            <Campo label="Peso (kg)">
              <input
                type="number"
                min="20"
                max="300"
                step="0.1"
                value={valores.peso_kg}
                onChange={alterar("peso_kg")}
                placeholder="Ex.: 72.5"
                className={campoBase}
              />
            </Campo>
            <Campo label="Faixa / graduação">
              <input value={valores.faixa} onChange={alterar("faixa")} placeholder="Ex.: Azul" className={campoBase} />
            </Campo>
          </>
        ) : null}

        <Campo label="Equipe / academia / escola">
          <input value={valores.equipe} onChange={alterar("equipe")} placeholder="Nome da equipe" className={campoBase} />
        </Campo>

        <Campo label="Professor / responsável">
          <input value={valores.responsavel} onChange={alterar("responsavel")} placeholder="Quem inscreveu" className={campoBase} />
        </Campo>

        <Campo label="Telefone">
          <input value={valores.telefone} onChange={alterar("telefone")} placeholder="(00) 00000-0000" className={campoBase} />
        </Campo>

        <Campo label="E-mail">
          <input type="email" value={valores.email} onChange={alterar("email")} placeholder="voce@email.com" className={campoBase} />
        </Campo>

        <Campo label="Cidade">
          <input value={valores.cidade} onChange={alterar("cidade")} placeholder="Cidade, UF" className={campoBase} />
        </Campo>

        <Campo label="Observações">
          <input value={valores.observacoes} onChange={alterar("observacoes")} placeholder="Restrições, informações extras" className={campoBase} />
        </Campo>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-arena-red/20 bg-arena-red/[0.04] px-4 py-3">
        <Calculator className="h-4 w-4 text-arena-red" />
        <p className="text-[12px] font-semibold text-arena-ink">
          Idade: {classificacao.idade != null ? `${classificacao.idade} anos` : "—"}
          <span className="mx-2 text-arena-gray">·</span>
          Categoria: {classificacao.categoria_idade ?? "—"}
          {luta ? (
            <>
              <span className="mx-2 text-arena-gray">·</span>
              Divisão: {classificacao.categoria_peso ?? "—"}
            </>
          ) : null}
        </p>
      </div>

      {erro ? <p className="mt-4 rounded-xl bg-arena-red/10 px-3.5 py-2.5 text-[12.5px] text-arena-red">{erro}</p> : null}

      <button
        type="submit"
        disabled={salvando}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-arena-red px-5 py-3.5 font-display text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-arena-orange disabled:opacity-60"
      >
        {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Criar ficha
      </button>
    </form>
  );
}