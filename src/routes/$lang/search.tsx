import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { PromptCard } from "@/components/prompt-card";
import { categories, catName } from "@/lib/catalog";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { usePublished } from "@/lib/store";

export const Route = createFileRoute("/$lang/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: SearchPage,
});

function SearchPage() {
  const { lang: raw } = Route.useParams();
  const { q } = Route.useSearch();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const list = usePublished();
  const needle = q.trim().toLowerCase().replace(/^@/, "");
  const rows = list.filter((p) => {
    if (!needle) return false;
    const cat = categories.find((c) => c.id === p.cat);
    const blob = `${p.title["zh-CN"]} ${p.title.en} ${p.author} ${p.blurb["zh-CN"]} ${p.blurb.en} ${cat ? cat.zh + cat.en : ""}`.toLowerCase();
    return blob.includes(needle);
  });
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-20">
      <Link to="/$lang" params={{ lang }} className="inline-flex items-center gap-1 text-sm text-mute">
        <ChevronLeft className="size-4" />
        {tx(lang, "首页", "Home")}
      </Link>
      <h1 className="mt-4 text-title font-bold">{q ? tx(lang, `「${q}」的结果`, `Results for “${q}”`) : tx(lang, "搜索", "Search")}</h1>
      <p className="mt-2 text-body text-mute">
        {q ? tx(lang, `${rows.length} 条匹配`, `${rows.length} matches`) : tx(lang, "输入名称、分类或 @作者。", "Type a title, category or @author.")}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link key={c.id} to="/$lang/c/$slug" params={{ lang, slug: c.id }} className="rounded-full border border-line-2 px-3 py-1.5 text-fine text-mute">
            {catName(c, lang)}
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((item) => (
          <PromptCard key={item.id} item={item} lang={lang} />
        ))}
      </div>
      {q ? <p className="py-8 text-center text-fine text-mute">{tx(lang, "已显示全部", "End of list")}</p> : null}
    </div>
  );
}
