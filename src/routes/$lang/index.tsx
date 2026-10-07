import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { PromptCard } from "@/components/prompt-card";
import { categories, catIntro, catName, HOME_CATS, MOSAIC, prompts } from "@/lib/catalog";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { useApp, usePublished } from "@/lib/store";

export const Route = createFileRoute("/$lang/")({
  component: HomePage,
});

function score(votes: number, id: string, deltas: Record<string, number>) {
  return Math.max(0, votes + (deltas[id] ?? 0));
}

function HomePage() {
  const { lang: raw } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const navigate = Route.useNavigate();
  const [q, setQ] = useState("");
  const total = usePublished();
  const list = total;
  const setSortOpen = useApp((s) => s.setSortOpen);
  const deltas = useApp((s) => s.deltas);
  const ranked = [...list].sort((a, b) => score(b.votes, b.id, deltas) - score(a.votes, a.id, deltas) || b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 md:px-10 lg:grid-cols-[452px_1fr] lg:px-20 lg:py-16">
        <div>
          <div className="grid grid-cols-4 gap-4">
            {MOSAIC.map((src) => (
              <img key={src + src.length} src={src} alt="" className="aspect-square w-full rounded-control object-cover" />
            ))}
          </div>
          <p className="mt-3 text-fine text-mute">{tx(lang, "图源 · 示例图，仅提示类型", "Sample images, for prompt type only")}</p>
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-hero font-bold">{tx(lang, "找到能直接复用的 AI 提示词", "Prompts you can reuse as-is")}</h1>
          <div className="flex items-center gap-3">
            <p className="font-display text-stat">{list.length || prompts.length}</p>
            <div>
              <p className="text-lead">{tx(lang, "条提示词已收录", "prompts collected")}</p>
              <span className="mt-1 inline-flex h-6 items-center rounded-md bg-chip px-2 text-fine text-mute">{tx(lang, "示例数据", "Sample data")}</span>
            </div>
          </div>
          <p className="max-w-xl text-lead text-mute">
            {tx(lang, "按社区投票排序，每一条都署名作者。未登录也可浏览，复制完整提示词需登录。", "Ranked by community votes, every prompt signed. Browse while signed out. Copying the full prompt needs a sign-in.")}
          </p>
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/$lang/search", params: { lang }, search: { q: q.trim() } });
            }}
          >
            <label className="flex h-12 flex-1 items-center gap-2.5 rounded-control border border-line-2 bg-surface px-4">
              <Search className="size-4 text-mute" aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx(lang, "搜索名称、分类或 @作者", "Search prompts or @authors")} className="w-full bg-transparent text-body outline-none placeholder:text-mute" />
            </label>
            <button type="submit" className="h-11 rounded-control bg-ink px-5 text-body font-medium text-on-ink">{tx(lang, "搜索", "Search")}</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat.id} to="/$lang/c/$slug" params={{ lang, slug: cat.id }} className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-3 py-1.5 text-fine">
                <span>{catName(cat, lang)}</span>
                <span className="font-mono text-mute">{list.filter((p) => p.cat === cat.id).length}</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/$lang/categories" params={{ lang }} className="inline-flex h-11 items-center rounded-control bg-ink px-5 text-body font-medium text-on-ink">{tx(lang, "浏览全部", "Browse all")}</Link>
            <Link to="/$lang/submit" params={{ lang }} className="inline-flex h-11 items-center rounded-control border border-line-2 px-5 text-body">{tx(lang, "投稿提示词", "Submit a prompt")}</Link>
            <button type="button" onClick={() => setSortOpen(true)} className="inline-flex h-11 items-center rounded-control bg-chip px-5 text-body">{tx(lang, "排序说明", "Ranking")}</button>
          </div>
        </div>
      </section>
      {HOME_CATS.map((id) => {
        const cat = categories.find((c) => c.id === id);
        if (!cat) return null;
        const rows = list.filter((p) => p.cat === id).slice(0, 4);
        const count = list.filter((p) => p.cat === id).length;
        return (
          <section key={id} className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-h2 font-bold">{catName(cat, lang)}</h2>
                <p className="mt-1 text-sm text-mute">{catIntro(cat, lang)} · {count} {tx(lang, "条", "")}</p>
              </div>
              <Link to="/$lang/c/$slug" params={{ lang, slug: cat.id }} className="inline-flex items-center gap-1 text-sm font-medium">
                {tx(lang, `查看全部 ${count} 条`, `View all ${count}`)}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {rows.map((item) => (
                <PromptCard key={item.id} item={item} lang={lang} />
              ))}
            </div>
          </section>
        );
      })}
      <section className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
        <h2 className="text-h2 font-bold">{tx(lang, "更多分类", "More categories")}</h2>
        <p className="mt-1 text-sm text-mute">{tx(lang, "共 13 个一级分类，条数为示例数据", "13 top-level categories; counts are sample data")}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.filter((c) => !HOME_CATS.includes(c.id)).map((cat) => (
            <Link key={cat.id} to="/$lang/c/$slug" params={{ lang, slug: cat.id }} className="flex items-center gap-3 rounded-card border border-line bg-card px-4 py-3">
              <img src={cat.image} alt="" className="size-10 rounded-lg object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block text-body">{catName(cat, lang)}</span>
                <span className="block truncate text-fine text-mute">{catIntro(cat, lang)}</span>
              </span>
              <span className="text-fine text-mute">{list.filter((p) => p.cat === cat.id).length}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-h2 font-bold">{tx(lang, "投票最多", "Top voted")}</h2>
          <span className="inline-flex h-6 items-center rounded-md bg-chip px-2 text-fine text-mute">{tx(lang, "示例数据", "Sample data")}</span>
        </div>
        <div className="grid gap-x-16 md:grid-cols-2">
          {ranked.slice(0, 8).map((item, index) => (
            <Link key={item.id} to="/$lang/p/$id" params={{ lang, id: item.id }} className="flex items-center gap-3 border-b border-line py-3">
              <span className="w-5 font-mono text-mute">{index + 1}</span>
              <img src={item.image} alt="" className="size-8 rounded-md object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body">{item.title[lang]}</span>
                <span className="block truncate text-fine text-mute">@{item.author} · {catName(categories.find((c) => c.id === item.cat)!, lang)}</span>
              </span>
              <span className="text-fine">{Math.max(0, item.votes + (deltas[item.id] ?? 0))}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
