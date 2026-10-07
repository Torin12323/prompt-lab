import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, catName } from "@/lib/catalog";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { useApp, usePublished } from "@/lib/store";

export const Route = createFileRoute("/$lang/rank")({
  component: RankPage,
});

function RankPage() {
  const { lang: raw } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const list = usePublished();
  const deltas = useApp((s) => s.deltas);
  const rows = [...list].sort((a, b) => (b.votes + (deltas[b.id] ?? 0)) - (a.votes + (deltas[a.id] ?? 0)) || b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <div className="flex items-center gap-3">
        <h1 className="text-title font-bold">{tx(lang, "投票榜", "Top voted")}</h1>
        <span className="inline-flex h-6 items-center rounded-md bg-chip px-2 text-fine text-mute">{tx(lang, "示例数据", "Sample data")}</span>
      </div>
      <p className="mt-2 max-w-2xl text-body text-mute">{tx(lang, "只按投票数排列。票数相同则新发布的在前。收藏和复制不计入。", "Ordered by votes. Ties go to the newer prompt. Saves and copies do not count.")}</p>
      <div className="mt-8 grid gap-x-16 md:grid-cols-2">
        {rows.map((item, index) => {
          const cat = categories.find((c) => c.id === item.cat);
          return (
            <Link key={item.id} to="/$lang/p/$id" params={{ lang, id: item.id }} className="flex items-center gap-3 border-b border-line py-3">
              <span className="w-6 font-mono text-mute">{index + 1}</span>
              <img src={item.image} alt="" className="size-8 rounded-md object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{item.title[lang]}</span>
                <span className="block truncate text-fine text-mute">@{item.author}{cat ? ` · ${catName(cat, lang)}` : ""}</span>
              </span>
              <span className="rounded-full border border-line-2 px-2 py-1 text-fine">{Math.max(0, item.votes + (deltas[item.id] ?? 0))}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
