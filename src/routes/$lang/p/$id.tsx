import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronUp, Copy, Heart, X, ZoomIn } from "lucide-react";
import { useState } from "react";
import { useMemo } from "react";
import { PromptCard } from "@/components/prompt-card";
import { catById, catName, textOf, type PromptItem } from "@/lib/catalog";
import { copyBlock, writeClipboard } from "@/lib/format";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { useApp, usePublished } from "@/lib/store";

export const Route = createFileRoute("/$lang/p/$id")({
  component: DetailPage,
});

function DetailPage() {
  const { lang: raw, id } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const list = usePublished();
  const item = list.find((p) => p.id === id);
  const related = useMemo(
    () => list.filter((p) => item && p.cat === item.cat && p.id !== item.id).slice(0, 4),
    [list, item],
  );
  if (!item) {
    return <div className="mx-auto max-w-3xl px-5 py-20">{tx(lang, "没有找到这条提示词。", "Prompt not found.")}</div>;
  }
  return <Detail item={item} lang={lang} related={related} />;
}

function Detail({ item, lang, related }: { item: PromptItem; lang: UiLang; related: PromptItem[] }) {
  const user = useApp((s) => s.current());
  const votes = useApp((s) => s.voteOf(item.id));
  const voted = useApp((s) => s.hasVoted(item.id));
  const fav = useApp((s) => s.hasFav(item.id));
  const toggleVote = useApp((s) => s.toggleVote);
  const toggleFav = useApp((s) => s.toggleFav);
  const setGate = useApp((s) => s.setGateOpen);
  const showToast = useApp((s) => s.showToast);
  const cat = catById(item.cat);
  const [copied, setCopied] = useState<string | null>(null);
  const [showEn, setShowEn] = useState(false);
  const [light, setLight] = useState(false);
  const [zoom, setZoom] = useState(false);
  const readLang: UiLang = showEn ? (lang === "en" ? "zh-CN" : "en") : lang;

  async function copy(kind: "positive" | "negative" | "all" | "params") {
    if (!user) {
      setGate(true);
      return;
    }
    const ok = await writeClipboard(copyBlock(item, lang, kind));
    if (!ok) {
      showToast(tx(lang, "浏览器拦截了剪贴板，请手动选择文本。", "The browser blocked the clipboard. Select the text instead."));
      return;
    }
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  function gateOr(action: () => void) {
    if (!user) {
      setGate(true);
      return;
    }
    action();
  }

  const label = (kind: string, idle: string, done: string) => (copied === kind ? done : idle);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-10 lg:px-20">
      <p className="text-fine text-mute">
        <Link to="/$lang" params={{ lang }}>{tx(lang, "首页", "Home")}</Link>
        <span className="px-2">/</span>
        {cat ? <Link to="/$lang/c/$slug" params={{ lang, slug: cat.id }}>{catName(cat, lang)}</Link> : null}
        <span className="px-2">/</span>
        <span className="text-ink">{textOf(item.title, lang)}</span>
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-title font-bold">{textOf(item.title, lang)}</h1>
          <p className="mt-3 max-w-3xl text-lead text-mute">{textOf(item.blurb, lang)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-fine text-mute">
            <span>@{item.author}</span>
            {cat ? <span className="rounded-md bg-chip px-2 py-1">{catName(cat, lang)}</span> : null}
            <span>{item.createdAt}</span>
            <span className="opacity-70">{tx(lang, "示例数据", "Sample data")}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => gateOr(() => toggleVote(item.id))} className="inline-flex h-11 items-center gap-1 rounded-full border border-line-2 px-3">
              <ChevronUp className="size-4" />
              {voted ? tx(lang, "已投票", "Voted") : tx(lang, "投票", "Vote")}
              <span className="font-display">{votes}</span>
            </button>
            <button type="button" onClick={() => gateOr(() => toggleFav(item.id))} className="inline-flex h-11 items-center gap-1 rounded-full border border-line-2 px-3">
              <Heart className={`size-4 ${fav ? "fill-ink" : ""}`} />
              {fav ? tx(lang, "已收藏", "Saved") : tx(lang, "收藏", "Save")}
            </button>
            <button type="button" onClick={() => copy("all")} className="inline-flex h-11 items-center gap-1 rounded-full bg-ink px-4 font-medium text-on-ink">
              {copied === "all" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {label("all", tx(lang, "一键复制所有提示词", "Copy all prompts"), tx(lang, "已复制全部", "Copied all"))}
            </button>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(window.location.href).then(() => showToast(tx(lang, "链接已复制", "Link copied")));
              }}
              className="inline-flex h-11 items-center rounded-full bg-chip px-4"
            >
              {tx(lang, "复制链接", "Copy link")}
            </button>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-h2 font-bold">{tx(lang, "提示词", "Prompt")}</h2>
            <button type="button" onClick={() => setShowEn((v) => !v)} className="text-sm text-mute">
              {showEn ? tx(lang, "显示原文", "Show original") : tx(lang, "翻译", "Translate")}
            </button>
          </div>
          {user ? (
            <div className="mt-4 flex flex-col gap-4">
              <Block title={tx(lang, "正向提示词", "Positive prompt")} body={textOf(item.positive, readLang)} action={label("positive", tx(lang, "复制正向提示词", "Copy positive"), tx(lang, "已复制正向", "Copied positive"))} onCopy={() => copy("positive")} />
              {item.negative ? (
                <Block title={tx(lang, "反向提示词", "Negative prompt")} body={textOf(item.negative, readLang)} action={label("negative", tx(lang, "复制反向提示词", "Copy negative"), tx(lang, "已复制反向", "Copied negative"))} onCopy={() => copy("negative")} />
              ) : null}
              {item.params ? (
                <Block title={tx(lang, "参数", "Parameters")} body={item.params} action={label("params", tx(lang, "复制参数", "Copy parameters"), tx(lang, "已复制参数", "Copied parameters"))} onCopy={() => copy("params")} mono />
              ) : null}
              <p className="text-fine text-mute">{tx(lang, "翻译只供阅读。复制始终使用原文语言。", "Translation is for reading. Copy always uses the original language.")}</p>
            </div>
          ) : (
            <div className="mt-4 rounded-panel border border-line bg-card p-6">
              <p className="text-lead">{tx(lang, "登录后查看并复制完整提示词。", "Sign in to read and copy the full prompt.")}</p>
              <p className="mt-2 text-body text-mute">{textOf(item.blurb, lang)}</p>
              <button type="button" onClick={() => setGate(true)} className="mt-4 inline-flex h-11 items-center rounded-control bg-ink px-5 font-medium text-on-ink">
                {tx(lang, "登录后复制", "Sign in to copy")}
              </button>
            </div>
          )}
        </div>
        <aside>
          <button type="button" onClick={() => gateOr(() => setLight(true))} className="block w-full overflow-hidden rounded-panel border border-line">
            <img src={item.image} alt="" className={`aspect-square w-full object-cover ${user ? "" : "scale-105 blur-sm"}`} />
          </button>
          <p className="mt-2 text-fine text-mute">
            {user ? tx(lang, "点击查看原图", "View original") : tx(lang, "查看原图需要登录", "Sign in to view the original")}
          </p>
          <p className="mt-1 text-fine text-mute">{tx(lang, "图源 · 示例图", "Sample image")}</p>
        </aside>
      </div>
      <section className="mt-12">
        <h2 className="text-h2 font-bold">{tx(lang, "相关提示词", "Related prompts")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {related.map((p) => (
            <PromptCard key={p.id} item={p} lang={lang} />
          ))}
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 p-3 backdrop-blur md:hidden">
        <button type="button" onClick={() => copy("all")} className="flex h-11 w-full items-center justify-center rounded-full bg-ink font-medium text-on-ink">
          {label("all", tx(lang, "一键复制所有提示词", "Copy all prompts"), tx(lang, "已复制全部", "Copied all"))}
        </button>
      </div>
      {light ? (
        <div className="fixed inset-0 z-50 bg-bg">
          <div className="flex h-16 items-center justify-between px-4">
            <button type="button" onClick={() => setLight(false)} className="inline-flex h-11 items-center gap-1" aria-label={tx(lang, "关闭", "Close")}>
              <ChevronLeft className="size-4" />
              {tx(lang, "返回", "Back")}
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setZoom((v) => !v)} className="inline-flex h-11 items-center gap-1 rounded-full border border-line-2 px-3">
                <ZoomIn className="size-4" />
                {zoom ? "200%" : "100%"}
              </button>
              <button type="button" onClick={() => copy("all")} className="inline-flex h-11 items-center rounded-full bg-ink px-4 text-on-ink">
                {tx(lang, "复制全部", "Copy all")}
              </button>
              <button type="button" onClick={() => setLight(false)} className="grid size-11 place-items-center" aria-label={tx(lang, "关闭", "Close")}>
                <X />
              </button>
            </div>
          </div>
          <div className="grid h-[calc(100vh-4rem)] place-items-center overflow-auto p-6">
            <img src={item.image} alt="" className={zoom ? "max-w-none w-[200%]" : "max-h-full max-w-full object-contain"} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Block({ title, body, action, onCopy, mono }: { title: string; body: string; action: string; onCopy: () => void; mono?: boolean }) {
  return (
    <section className="rounded-panel border border-line bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium">{title}</h3>
        <button type="button" onClick={onCopy} className="inline-flex h-9 items-center rounded-full border border-line-2 px-3 text-fine">
          {action}
        </button>
      </div>
      <p className={`mt-3 text-body whitespace-pre-wrap text-ink ${mono ? "font-mono text-fine" : ""}`}>{body}</p>
    </section>
  );
}
