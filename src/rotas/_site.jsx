import { Outlet, createFileRoute } from "@tanstack/react-router";
import Header from "@/components/arena/Header";
import Footer from "@/components/arena/Footer";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-arena-ink">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}