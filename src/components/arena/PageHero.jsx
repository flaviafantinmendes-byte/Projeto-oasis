import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function PageHero({ eyebrow, title, description, image, children, className }) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-arena-red", className)}>
      {image ? (
        <>
          <Image src={image} alt="" className="absolute inset-0 h-full w-full opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#A8000C] via-arena-red/90 to-arena-orange/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,106,0,0.55),transparent_55%)]" />
      )}
      <div className="absolute inset-y-0 -left-10 w-24 -skew-x-12 bg-arena-yellow/25" />
      <div className="arena-container relative py-14 md:py-16">
        {eyebrow ? <p className="arena-overline text-arena-yellow">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl font-display text-[32px] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-white sm:text-[42px] lg:text-[52px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-[15px]">{description}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}