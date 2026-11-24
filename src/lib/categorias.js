// Regras de modalidade, idade e categoria compartilhadas entre lutas e modalidades artísticas.
// O mesmo cálculo serve para Jiu-Jitsu, Taekwondo, Música e Dança.

export const MODALIDADES = [
  { slug: "jiu-jitsu", nome: "Jiu-Jitsu", tipo: "luta", descricao: "Faixas, idades e divisões de peso" },
  { slug: "taekwondo", nome: "Taekwondo", tipo: "luta", descricao: "Kyorugi por idade, sexo e peso" },
  { slug: "musica", nome: "Música", tipo: "artistica", descricao: "Apresentações por idade e sexo" },
  { slug: "danca", nome: "Dança", tipo: "artistica", descricao: "Coreografias por idade e sexo" },
];

export const SEXOS = ["Masculino", "Feminino"];

const normalizar = (valor = "") =>
  String(valor)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export function modalidadeInfo(valor) {
  const alvo = normalizar(valor);
  if (!alvo) return null;
  return (
    MODALIDADES.find((modalidade) => modalidade.slug === alvo.replace(/\s+/g, "-")) ??
    MODALIDADES.find((modalidade) => normalizar(modalidade.nome) === alvo) ??
    null
  );
}

export function isLuta(valor) {
  return modalidadeInfo(valor)?.tipo === "luta";
}

export function exigePeso(valor) {
  return isLuta(valor);
}

export function calcularIdade(dataNascimento, referencia = new Date()) {
  if (!dataNascimento) return null;
  const texto = String(dataNascimento);
  const nascimento = new Date(texto.length <= 10 ? `${texto}T00:00:00Z` : texto);
  if (Number.isNaN(nascimento.getTime())) return null;

  let idade = referencia.getUTCFullYear() - nascimento.getUTCFullYear();
  const diferencaMes = referencia.getUTCMonth() - nascimento.getUTCMonth();
  if (diferencaMes < 0 || (diferencaMes === 0 && referencia.getUTCDate() < nascimento.getUTCDate())) idade -= 1;
  return idade >= 0 ? idade : null;
}

export const CATEGORIAS_IDADE = [
  { slug: "kids", label: "Kids", min: 4, max: 9 },
  { slug: "infantil", label: "Infantil", min: 10, max: 13 },
  { slug: "juvenil", label: "Juvenil", min: 14, max: 17 },
  { slug: "adulto", label: "Adulto", min: 18, max: 29 },
  { slug: "master", label: "Master", min: 30, max: 39 },
  { slug: "senior", label: "Sênior", min: 40, max: 200 },
];

export function categoriaEtaria(idade) {
  if (idade === null || idade === undefined || Number.isNaN(Number(idade))) return null;
  return CATEGORIAS_IDADE.find((categoria) => idade >= categoria.min && idade <= categoria.max) ?? null;
}

// Divisões de peso por modalidade e sexo (apenas lutas).
export const DIVISOES_PESO = {
  "jiu-jitsu": {
    Masculino: [
      { label: "Galo", max: 57 },
      { label: "Pluma", max: 64 },
      { label: "Pena", max: 70 },
      { label: "Leve", max: 76 },
      { label: "Médio", max: 82 },
      { label: "Meio-pesado", max: 88 },
      { label: "Pesado", max: 94 },
      { label: "Super-pesado", max: Infinity },
    ],
    Feminino: [
      { label: "Galo", max: 48 },
      { label: "Pluma", max: 53 },
      { label: "Pena", max: 58 },
      { label: "Leve", max: 64 },
      { label: "Médio", max: 69 },
      { label: "Meio-pesado", max: 74 },
      { label: "Pesado", max: 80 },
      { label: "Super-pesado", max: Infinity },
    ],
  },
  taekwondo: {
    Masculino: [
      { label: "Fin", max: 54 },
      { label: "Fly", max: 58 },
      { label: "Bantam", max: 63 },
      { label: "Feather", max: 68 },
      { label: "Light", max: 74 },
      { label: "Welter", max: 80 },
      { label: "Middle", max: 87 },
      { label: "Heavy", max: Infinity },
    ],
    Feminino: [
      { label: "Fin", max: 46 },
      { label: "Fly", max: 49 },
      { label: "Bantam", max: 53 },
      { label: "Feather", max: 57 },
      { label: "Light", max: 62 },
      { label: "Welter", max: 67 },
      { label: "Middle", max: 73 },
      { label: "Heavy", max: Infinity },
    ],
  },
};

export function categoriaPeso(modalidade, sexo, pesoKg) {
  const info = modalidadeInfo(modalidade);
  if (!info || info.tipo !== "luta") return null;
  const peso = Number(pesoKg);
  if (!peso) return null;
  const tabela = DIVISOES_PESO[info.slug]?.[sexo];
  if (!tabela) return null;
  const divisao = tabela.find((faixa) => peso <= faixa.max);
  return divisao ? `Peso ${divisao.label}` : null;
}

// Classificação usada por todos os formulários: devolve idade, categoria etária e
// divisão de peso (esta última só quando a modalidade exige pesagem).
export function classificarAtleta({ modalidade, sexo, data_nascimento, peso_kg, referencia } = {}) {
  const idade = calcularIdade(data_nascimento, referencia);
  const faixaIdade = categoriaEtaria(idade);
  return {
    idade,
    categoria_idade: faixaIdade?.label ?? null,
    categoria_peso: categoriaPeso(modalidade, sexo, peso_kg),
  };
}