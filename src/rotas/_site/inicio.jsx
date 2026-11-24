import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/arena/Hero";
import ModalitiesSection from "@/components/arena/ModalitiesSection";
import JoinBanner from "@/components/arena/JoinBanner";
import { listModalidadesOficiais } from "@/lib/arena-api";
import { useAsync } from "@/hooks/useAsync";

export const Route = createFileRoute("/_site/inicio")({
  head: () => ({
    meta: [
      { title: "Oásis Eventos — Inscrições" },
      {
        name: "description",
        content:
          "Inscrições e gestão de competições de Jiu-Jitsu, Taekwondo, Música e Dança da Oásis Eventos.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useAsync(() => listModalidadesOficiais(), []);

  return (
    <>
      <Hero />
      <ModalitiesSection modalidades={data ?? []} />
      <JoinBanner />
    </>
  );
}