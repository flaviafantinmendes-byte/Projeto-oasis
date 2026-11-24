import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white px-6 py-16 text-center",
        className,
      )}
    >
      {Icon ? <Icon className="h-9 w-9 text-arena-red" /> : null}
      <p className="mt-4 font-display text-lg font-bold uppercase text-arena-ink">{title}</p>
      {description ? <p className="mt-2 max-w-sm text-sm leading-relaxed text-arena-gray">{description}</p> : null}
      {action}
    </div>
  );
}