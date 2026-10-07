import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PromptCard } from "@/components/prompt-card";
import { catById, catLead, catName, categories } from "@/lib/catalog";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { useApp, usePublished } from "@/lib/store";

export const Route = createFileRoute("/$lang/c/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { lang: raw, slug } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const cat = catById(slug);
  const list = usePublished();
  const deltas = useApp((s) => s.deltas);
  const setSortOpen = useApp((s) => s.setSortOpen);
  const [sort, setSort] = useState<"votes" | "new">("votes");
  const [sub, setSub] = useState("");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const base = list.filter((p) => p.cat === slug && (!sub || p.sub === sub) && (!q || `${p.title["zh-CN"]} ${p.title.en} ${p.author}`.toLowerCase().includes(q.toLowerCase())));
    return base.sort((a, b) => {
      if (sort === "new") return b.createdAt.localeCompare(a.createdAt);
      return (b.votes + (deltas[b.id] ?? 0)) - (a.votes + (deltas[a.id] ?? 0)) || b.createdAt.localeCompare(a.createdAt);
    });
  }, [list, slug, sub, q, sort, deltas]);

  if (!cat) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <p>{tx(lang, "没有这个分类。", "That category does not exist.")}</p>
        <Link to="/$lang/categories" params={{ lang }} className="mt-4 inline-flex text-mute">{tx(lang, "查看全部分类", "All categories")}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-20">
      <div className="flex gap-2 overflow-auto pb-4">
        {categories.map((c) => (
          <Link key={c.id} to="/$lang/c/$slug" params={{ lang, slug: c.id }} className={`shrink-0 rounded-full border px-3 py-1.5 text-fine ${c.id === cat.id ? "border-ink" : "border-line-2 text-mute"}`}>
            {catName(c, lang)}
          </Link>
        ))}
      </div>
      <Link to="/$lang" params={{ lang }} className="inline-flex items-center gap-1 text-sm text-mute">
        <ChevronLeft className="size-4" aria-hidden />
        {tx(lang, "首页", "Home")}
      </Link>
      <div className="mt-5 flex items-center gap-4">
        <img src={cat.image} alt="" className="size-[72px] rounded-[18px] object-cover" />
        <div>
          <h1 className="text-title font-bold">{catName(cat, lang)}</h1>
          <p className="text-fine text-mute">{rows.length} {tx(lang, "条", "prompts")} · {tx(lang, "缩略图为示例图", "Sample thumbnails")}</p>
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-body text-mute">{catLead(cat, lang)}</p>
      <button type="button" onClick={() => setSortOpen(true)} className="mt-3 text-left text-fine text-mute opacity-80">
        {tx(lang, "排序说明：只按投票数排序，票数相同按发布时间；收藏是个人功能，收藏与复制次数都不参与排名。", "Ranking: votes only, ties by publish time. Saves and copies do not affect rank.")}
      </button>
      {cat.subs ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setSub("")} className={`h-9 rounded-full border px-3 text-fine ${sub === "" ? "border-ink" : "border-line-2 text-mute"}`}>{tx(lang, "全部", "All")}</button>
          {cat.subs.map((s) => (
            <button key={s.id} type="button" onClick={() => setSub(s.id)} className={`h-9 rounded-full border px-3 text-fine ${sub === s.id ? "border-ink" : "border-line-2 text-mute"}`}>
              {lang === "en" ? s.en : s.zh}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-11 items-center gap-2 text-sm">
          <span className="text-mute">{tx(lang, "排序：", "Sort:")}</span>
          <button type="button" onClick={() => setSort("votes")} className={sort === "votes" ? "font-medium text-ink" : "text-mute"}>{tx(lang, "投票最多", "Top voted")}</button>
          <span className="text-line-2">·</span>
          <button type="button" onClick={() => setSort("new")} className={sort === "new" ? "font-medium text-ink" : "text-mute"}>{tx(lang, "最新", "Newest")}</button>
        </div>
        <label className="flex h-9 w-full items-center gap-2 rounded-full border border-line-2 bg-surface px-3 sm:w-72">
          <Search className="size-4 text-mute" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx(lang, `在「${catName(cat, lang)}」中搜索`, `Search in ${catName(cat, lang)}`)} className="w-full bg-transparent text-fine outline-none" />
        </label>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((item) => (
          <PromptCard key={item.id} item={item} lang={lang} />
        ))}
      </div>
      <p className="py-8 text-center text-fine text-mute">{tx(lang, "已显示全部", "End of list")}</p>
    </div>
  );
}
