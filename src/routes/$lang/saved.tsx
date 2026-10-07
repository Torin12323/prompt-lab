import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMemo } from "react";
import { PromptCard } from "@/components/prompt-card";
import { categories, catName } from "@/lib/catalog";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { useApp, usePublished } from "@/lib/store";

const EMPTY: string[] = [];

export const Route = createFileRoute("/$lang/saved")({
  component: SavedPage,
});

function SavedPage() {
  const { lang: raw } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const user = useApp((s) => s.current());
  const ready = useApp((s) => s.ready);
  const extras = useApp((s) => s.extras);
  const favMap = useApp((s) => s.favs);
  const published = usePublished();
  const favs = user ? favMap[user.id] ?? EMPTY : EMPTY;
  const mine = useMemo(() => extras.filter((e) => e.ownerId === user?.id && e.status === "published"), [extras, user]);
  const drafts = useMemo(() => extras.filter((e) => e.ownerId === user?.id && e.status === "draft"), [extras, user]);
  const publishDraft = useApp((s) => s.publishDraft);
  const showToast = useApp((s) => s.showToast);
  const [tab, setTab] = useState<"fav" | "mine" | "draft">("fav");
  const [cat, setCat] = useState("");

  if (!ready) return <div className="px-5 py-16 text-mute">{tx(lang, "正在读取本地收藏…", "Loading your library…")}</div>;
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20">
        <h1 className="text-title font-bold">{tx(lang, "我的收藏", "Saved")}</h1>
        <p className="mt-3 text-body text-mute">{tx(lang, "登录后查看收藏、已发布和草稿。", "Sign in to see saves, posts and drafts.")}</p>
        <Link to="/$lang/login" params={{ lang }} search={{ next: `/${lang}/saved` }} className="mt-6 inline-flex h-11 items-center rounded-control bg-ink px-5 font-medium text-on-ink">
          {tx(lang, "登录", "Sign in")}
        </Link>
      </div>
    );
  }

  const favItems = published.filter((p) => favs.includes(p.id) && (!cat || p.cat === cat));
  const mineItems = mine.filter((p) => !cat || p.cat === cat);
  const rows = tab === "fav" ? favItems : tab === "mine" ? mineItems : drafts;

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 lg:px-20">
      <div className="flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-chip text-2xl font-bold">{user.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-mute">{tx(lang, "受邀成员", "Invited member")} · {user.joined}</p>
        </div>
      </div>
      <div className="mt-6 flex gap-7 border-b border-line">
        {(
          [
            ["fav", tx(lang, "我的收藏", "Saved")],
            ["mine", tx(lang, "我发布的", "Posted")],
            ["draft", tx(lang, "草稿", "Drafts")],
          ] as const
        ).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)} className={`pb-3 text-lead ${tab === key ? "border-b-2 border-ink font-medium" : "text-mute"}`}>
            {label}
          </button>
        ))}
      </div>
      {tab !== "draft" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setCat("")} className={`h-9 rounded-full border px-3 text-fine ${cat === "" ? "border-ink" : "border-line-2 text-mute"}`}>{tx(lang, "全部", "All")}</button>
          {categories.map((c) => (
            <button key={c.id} type="button" onClick={() => setCat(c.id)} className={`h-9 rounded-full border px-3 text-fine ${cat === c.id ? "border-ink" : "border-line-2 text-mute"}`}>
              {catName(c, lang)}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rows.map((item) => (
          <div key={item.id}>
            <PromptCard item={item} lang={lang} />
            {tab === "draft" ? (
              <button
                type="button"
                className="mt-2 text-sm text-mute"
                onClick={() => {
                  publishDraft(item.id);
                  showToast(tx(lang, "已发布", "Published"));
                }}
              >
                {tx(lang, "发布这条草稿", "Publish this draft")}
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {rows.length === 0 ? <p className="py-16 text-mute">{tx(lang, "这里还是空的。", "Nothing here yet.")}</p> : null}
    </div>
  );
}
