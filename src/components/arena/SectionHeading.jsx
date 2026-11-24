import { cn } from "@/lib/utils";

export default function SectionHeading({ eyebrow, title, description, action, tone = "light", className }) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <span className={cn("arena-overline flex items-center gap-3", dark ? "text-arena-yellow" : "text-arena-red")}>
            <span className={cn("h-px w-8", dark ? "bg-arena-yellow/60" : "bg-arena-red/50")} />
            {eyebrow}
          </span>
        ) : null}
        <h2
          className={cn(
            "mt-4 font-display text-[30px] font-bold uppercase leading-[0.95] tracking-[-0.03em] sm:text-[38px] lg:text-[44px]",
            dark ? "text-white" : "text-arena-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className={cn("mt-4 max-w-xl text-sm leading-relaxed md:text-[15px]", dark ? "text-white/60" : "text-arena-gray")}>
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}