import { Link } from "@tanstack/react-router";
import { Check, ChevronUp, Copy } from "lucide-react";
import { useState } from "react";
import { catById, catName, textOf, type PromptItem } from "@/lib/catalog";
import { copyBlock, writeClipboard } from "@/lib/format";
import type { UiLang } from "@/lib/i18n";
import { tx } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export function PromptCard({ item, lang }: { item: PromptItem; lang: UiLang }) {
  const user = useApp((s) => s.current());
  const votes = useApp((s) => s.voteOf(item.id));
  const voted = useApp((s) => s.hasVoted(item.id));
  const toggleVote = useApp((s) => s.toggleVote);
  const setGateOpen = useApp((s) => s.setGateOpen);
  const showToast = useApp((s) => s.showToast);
  const [copied, setCopied] = useState(false);
  const cat = catById(item.cat);

  async function onCopy() {
    if (!user) {
      setGateOpen(true);
      return;
    }
    const ok = await writeClipboard(copyBlock(item, lang, "all"));
    if (!ok) {
      showToast(tx(lang, "浏览器拦截了剪贴板，请在详情页手动选择文本。", "The browser blocked the clipboard. Select the text on the detail page."));
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function onVote() {
    if (!user) {
      setGateOpen(true);
      return;
    }
    toggleVote(item.id);
  }

  return (
    <article className="flex gap-3 rounded-card border border-line bg-card p-4">
      <Link
        to="/$lang/p/$id"
        params={{ lang, id: item.id }}
        className="size-11 shrink-0 overflow-hidden rounded-[10px] border border-line"
      >
        <img src={item.image} alt="" className="size-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Link to="/$lang/p/$id" params={{ lang, id: item.id }} className="truncate text-body font-bold text-ink">
          {textOf(item.title, lang)}
        </Link>
        <p className="line-clamp-2 text-fine leading-relaxed text-mute">{textOf(item.blurb, lang)}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-fine text-mute">
          <span>@{item.author}</span>
          {cat ? (
            <span className="rounded-md bg-chip px-2 py-0.5">{catName(cat, lang)}</span>
          ) : null}
          <span className="opacity-70">{tx(lang, "示例数据", "Sample data")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onVote}
            className={`inline-flex h-11 min-h-11 items-center gap-1 rounded-full border px-2 text-fine ${
              voted ? "border-ink text-ink" : "border-line-2 text-ink"
            }`}
          >
            <ChevronUp className="size-3.5" aria-hidden />
            <span>{voted ? tx(lang, "已投票", "Voted") : tx(lang, "投票", "Vote")}</span>
            <span className="font-display">{votes}</span>
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-11 min-h-11 items-center gap-1 rounded-full bg-ink px-2.5 text-fine font-medium text-on-ink"
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? tx(lang, "已复制全部", "Copied all") : tx(lang, "复制全部", "Copy all")}
          </button>
        </div>
      </div>
    </article>
  );
}
