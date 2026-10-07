import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { isUiLang } from "@/lib/i18n";

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isUiLang(params.lang)) {
      throw redirect({ to: "/$lang", params: { lang: "zh-CN" } });
    }
  },
  component: LangLayout,
});

function LangLayout() {
  const { lang } = Route.useParams();
  if (!isUiLang(lang)) return null;
  return (
    <Shell lang={lang}>
      <Outlet />
    </Shell>
  );
}
