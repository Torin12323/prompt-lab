import type { PromptItem } from "@/lib/catalog";
import { textOf } from "@/lib/catalog";
import type { UiLang } from "@/lib/i18n";
import { tx } from "@/lib/i18n";

export function copyBlock(item: PromptItem, lang: UiLang, kind: "positive" | "negative" | "all" | "params") {
  const pos = textOf(item.positive, lang);
  const neg = item.negative ? textOf(item.negative, lang) : "";
  if (kind === "positive") return pos;
  if (kind === "negative") return neg;
  if (kind === "params") return item.params ?? "";
  const posLabel = tx(lang, "正向提示词", "Positive prompt");
  const negLabel = tx(lang, "反向提示词", "Negative prompt");
  if (!neg) return `${posLabel}: ${pos}`;
  return `${posLabel}: ${pos}\n${negLabel}: ${neg}`;
}

export async function writeClipboard(text: string) {
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the selection fallback.
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export function safeNext(next: string | undefined, fallback: string) {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}
