const ESTILOS = {
  pendente: "bg-arena-yellow/25 text-[#8a6400]",
  confirmada: "bg-emerald-500/15 text-emerald-700",
  cancelada: "bg-arena-red/10 text-arena-red",
};

const LABELS = { pendente: "Pendente", confirmada: "Confirmada", cancelada: "Cancelada" };

export default function StatusBadge({ status = "pendente" }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] ${ESTILOS[status] ?? ESTILOS.pendente}`}
    >
      {LABELS[status] ?? LABELS.pendente}
    </span>
  );
}