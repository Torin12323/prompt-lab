import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { detectLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: RedirectHome,
});

function RedirectHome() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/$lang", params: { lang: detectLang() }, replace: true });
  }, [navigate]);

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6 text-center">
      <div>
        <p className="font-display text-stat text-ink">提</p>
        <p className="mt-3 text-lead text-mute">提词所 Prompt Lab</p>
      </div>
    </main>
  );
}
