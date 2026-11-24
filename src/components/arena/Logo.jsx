import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { BRAND_LOGO } from "@/lib/arena-images";

export default function Logo({ tone = "light", className }) {
  const dark = tone === "dark";
  return (
    <Link
      to="/"
      className={cn("group flex items-center", className)}
      aria-label="Oásis Eventos — página inicial"
    >
      <Image
        src={BRAND_LOGO}
        alt="Oásis Eventos"
        fittingType="fit"
        className={cn(
          "h-12 w-12 shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.03] md:h-14 md:w-14",
          dark && "rounded-lg bg-white p-1",
        )}
      />
    </Link>
  );
}