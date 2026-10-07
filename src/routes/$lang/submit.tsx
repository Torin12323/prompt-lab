import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { categories, catById, catName, type CatId, type SubId } from "@/lib/catalog";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { useApp, type ExtraPrompt } from "@/lib/store";

export const Route = createFileRoute("/$lang/submit")({
  component: SubmitPage,
});

function SubmitPage() {
  const { lang: raw } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const user = useApp((s) => s.current());
  const ready = useApp((s) => s.ready);
  const addExtra = useApp((s) => s.addExtra);
  const showToast = useApp((s) => s.showToast);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [cat, setCat] = useState<CatId>("image");
  const [sub, setSub] = useState<SubId | "">("");
  const [positive, setPositive] = useState("");
  const [negative, setNegative] = useState("");
  const [params, setParams] = useState("");
  const [error, setError] = useState("");
  const category = catById(cat);

  if (!ready) return <div className="px-5 py-16 text-mute">{tx(lang, "正在读取账号…", "Loading account…")}</div>;
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20">
        <h1 className="text-title font-bold">{tx(lang, "发布提示词", "Submit a prompt")}</h1>
        <p className="mt-3 text-mute">{tx(lang, "投稿需要登录。发布后仅对受邀成员可见。", "Submitting needs a sign-in. Posts stay inside the invite-only library.")}</p>
        <Link to="/$lang/login" params={{ lang }} search={{ next: `/${lang}/submit` }} className="mt-6 inline-flex h-11 items-center rounded-control bg-ink px-5 font-medium text-on-ink">
          {tx(lang, "登录", "Sign in")}
        </Link>
      </div>
    );
  }

  function build(status: "published" | "draft"): ExtraPrompt | null {
    if (!user) return null;
    if (!title.trim() || !positive.trim()) {
      setError(tx(lang, "标题和正向提示词是必填。", "Title and positive prompt are required."));
      return null;
    }
    setError("");
    const text = { "zh-CN": title.trim(), en: title.trim() };
    return {
      id: `u-${Date.now()}`,
      cat,
      sub: sub || undefined,
      title: text,
      blurb: { "zh-CN": blurb.trim() || title.trim(), en: blurb.trim() || title.trim() },
      author: user.name,
      votes: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      image: category?.image ?? "/media/cabin.jpg",
      positive: { "zh-CN": positive.trim(), en: positive.trim() },
      negative: negative.trim() ? { "zh-CN": negative.trim(), en: negative.trim() } : undefined,
      params: params.trim() || undefined,
      ownerId: user.id,
      status,
    };
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-[1fr_320px] lg:px-20">
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          const item = build("published");
          if (!item) return;
          addExtra(item);
          showToast(tx(lang, "已发布", "Published"));
          navigate({ to: "/$lang/p/$id", params: { lang, id: item.id } });
        }}
      >
        <p className="text-fine text-mute">{tx(lang, "我发布的 / 发布提示词", "Posted / Submit")}</p>
        <h1 className="text-title font-bold">{tx(lang, "发布提示词", "Submit a prompt")}</h1>
        <p className="max-w-xl text-body text-mute">{tx(lang, "发布后仅对受邀成员可见。请只上传自己生成或有权使用的提示词。", "Posts are visible to invited members. Only submit prompts you wrote or have the right to share.")}</p>
        <Field label={tx(lang, "名称", "Title")} value={title} onChange={setTitle} />
        <Field label={tx(lang, "一句话介绍", "One-line intro")} value={blurb} onChange={setBlurb} />
        <label className="flex flex-col gap-2 text-sm">
          {tx(lang, "分类", "Category")}
          <select value={cat} onChange={(e) => { setCat(e.target.value as CatId); setSub(""); }} className="h-12 rounded-control border border-line-2 bg-surface px-3 text-body">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{catName(c, lang)}</option>
            ))}
          </select>
        </label>
        {category?.subs ? (
          <label className="flex flex-col gap-2 text-sm">
            {tx(lang, "二级分类", "Subcategory")}
            <select value={sub} onChange={(e) => setSub(e.target.value as SubId)} className="h-12 rounded-control border border-line-2 bg-surface px-3 text-body">
              <option value="">{tx(lang, "不指定", "None")}</option>
              {category.subs.map((s) => (
                <option key={s.id} value={s.id}>{lang === "en" ? s.en : s.zh}</option>
              ))}
            </select>
          </label>
        ) : null}
        <Area label={tx(lang, "正向提示词", "Positive prompt")} value={positive} onChange={setPositive} />
        <Area label={tx(lang, "反向提示词", "Negative prompt")} value={negative} onChange={setNegative} />
        <Field label={tx(lang, "参数", "Parameters")} value={params} onChange={setParams} />
        {error ? <p className="text-fine text-danger">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="h-11 rounded-control bg-ink px-5 font-medium text-on-ink">{tx(lang, "发布", "Publish")}</button>
          <button
            type="button"
            className="h-11 rounded-control border border-line-2 px-5"
            onClick={() => {
              const item = build("draft");
              if (!item) return;
              addExtra(item);
              showToast(tx(lang, "已存为草稿，可在「我的收藏 · 草稿」查看", "Saved as draft — find it under Saved · Drafts"));
              navigate({ to: "/$lang/saved", params: { lang } });
            }}
          >
            {tx(lang, "存为草稿", "Save draft")}
          </button>
        </div>
      </form>
      <aside className="h-fit rounded-panel border border-line bg-card p-4">
        <p className="text-fine text-mute">{tx(lang, "预览", "Preview")}</p>
        <img src={category?.image} alt="" className="mt-3 aspect-square w-full rounded-control object-cover" />
        <p className="mt-3 font-bold">{title || tx(lang, "未命名提示词", "Untitled prompt")}</p>
        <p className="mt-1 text-fine text-mute">{blurb || tx(lang, "一句话介绍会出现在卡片上。", "The one-line intro shows on the card.")}</p>
        <p className="mt-2 text-fine text-mute">@{user.name}</p>
      </aside>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="h-12 rounded-control border border-line-2 bg-surface px-4 text-body outline-none focus:border-ink" />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      {label}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={5} className="rounded-control border border-line-2 bg-surface px-4 py-3 text-body outline-none focus:border-ink" />
    </label>
  );
}
