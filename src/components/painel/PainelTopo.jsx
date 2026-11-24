export default function PainelTopo({ eyebrow, title, description, actions }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-r from-[#A8000C] via-arena-red to-arena-orange py-10 md:py-12">
      <div className="absolute inset-y-0 -left-10 w-24 -skew-x-12 bg-arena-yellow/25" />
      <div className="absolute -right-16 top-0 h-48 w-48 rounded-full bg-arena-yellow/30 blur-[90px]" />
      <div className="arena-container relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="arena-overline text-arena-yellow">{eyebrow}</p>
          <h1 className="mt-2 font-display text-[26px] font-bold uppercase leading-tight tracking-[-0.02em] text-white sm:text-[34px]">
            {title}
          </h1>
          {description ? <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/60">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}