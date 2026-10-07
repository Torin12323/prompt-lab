export type UiLang = "zh-CN" | "en";

export const LIVE_LANGS = ["zh-CN", "en"] as const;

export const LOCALES: { id: string; name: string; live: boolean }[] = [
  { id: "zh-CN", name: "简体中文", live: true },
  { id: "zh-TW", name: "繁體中文", live: false },
  { id: "en", name: "English", live: true },
  { id: "ja", name: "日本語", live: false },
  { id: "ko", name: "한국어", live: false },
  { id: "es", name: "Español", live: false },
  { id: "fr", name: "Français", live: false },
  { id: "de", name: "Deutsch", live: false },
];

export function isUiLang(value: string): value is UiLang {
  return value === "zh-CN" || value === "en";
}

export function detectLang(): UiLang {
  if (typeof window === "undefined") return "zh-CN";
  const stored = window.localStorage.getItem("promptlab-lang");
  if (stored === "en" || stored === "zh-CN") return stored;
  const nav = window.navigator.language.toLowerCase();
  if (nav.startsWith("zh")) return "zh-CN";
  return "en";
}

export function tx(lang: UiLang, zh: string, en: string) {
  return lang === "en" ? en : zh;
}

export function localeLabel(lang: UiLang) {
  return lang === "en" ? "English" : "简体中文";
}
