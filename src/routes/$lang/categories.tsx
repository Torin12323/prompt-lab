import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { categories, catIntro, catName } from "@/lib/catalog";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { usePublished } from "@/lib/store";

export const Route = createFileRoute("/$lang/categories")({
  component: AllCategories,
});

function AllCategories() {
  const { lang: raw } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const list = usePublished();
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-20">
      <Link to="/$lang" params={{ lang }} className="inline-flex items-center gap-1 text-sm text-mute">
        <ChevronLeft className="size-4" />
        {tx(lang, "首页", "Home")}
      </Link>
      <h1 className="mt-4 text-title font-bold">{tx(lang, "全部分类", "All categories")}</h1>
      <p className="mt-2 text-body text-mute">{tx(lang, "13 个一级分类。条数随收录变化，当前为示例数据。", "13 top-level categories. Counts follow the library and start as sample data.")}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => {
          const count = list.filter((p) => p.cat === cat.id).length;
          return (
            <Link key={cat.id} to="/$lang/c/$slug" params={{ lang, slug: cat.id }} className="flex items-center gap-4 rounded-card border border-line bg-card p-4">
              <img src={cat.image} alt="" className="size-14 rounded-control object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block text-lead font-medium">{catName(cat, lang)}</span>
                <span className="block text-fine text-mute">{catIntro(cat, lang)}</span>
              </span>
              <span className="font-display text-lead">{count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
