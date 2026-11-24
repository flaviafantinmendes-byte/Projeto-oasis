export const INSCRICAO_STATUS = {
  aberto: { label: "Inscrições abertas", className: "bg-arena-yellow text-arena-ink" },
  breve: { label: "Em breve", className: "bg-white/15 text-white backdrop-blur" },
  encerrado: { label: "Inscrições encerradas", className: "bg-arena-ink/70 text-white/80" },
};

export function statusInscricao(status) {
  return INSCRICAO_STATUS[status] || INSCRICAO_STATUS.breve;
}

export function formatEventDate(value) {
  if (!value) return "Data a definir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data a definir";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatNewsDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
}

export function formatTime(value) {
  if (!value) return "Tempo integral";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tempo integral";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
}

export function formatPoints(value) {
  return new Intl.NumberFormat("pt-BR").format(Number(value) || 0);
}

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatMoney(cents) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((Number(cents) || 0) / 100);
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}