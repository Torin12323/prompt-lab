import { Link, useLocation, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Globe, Menu, Search, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { GateDialog, SortDialog, Toast } from "@/components/dialogs";
import { categories, catName } from "@/lib/catalog";
import { LOCALES, localeLabel, tx, type UiLang } from "@/lib/i18n";
import { useApp, useHydrateApp } from "@/lib/store";

export function Shell({ lang, children }: { lang: UiLang; children: ReactNode }) {
  useHydrateApp();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useApp((s) => (s.ready ? s.current() : null));
  const logout = useApp((s) => s.logout);
  const setSortOpen = useApp((s) => s.setSortOpen);
  const showToast = useApp((s) => s.showToast);
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    setMenu(false);
    setLangOpen(false);
    setAvatarOpen(false);
    setCatOpen(false);
  }, [pathname]);

  function goSearch(event: React.FormEvent) {
    event.preventDefault();
    navigate({ to: "/$lang/search", params: { lang }, search: { q: q.trim() } });
  }

  function switchLang(id: string) {
    if (id !== "zh-CN" && id !== "en") {
      showToast(tx(lang, "即将上线", "Coming soon"));
      return;
    }
    window.localStorage.setItem("promptlab-lang", id);
    const next = pathname.replace(/^\/(zh-CN|en)/, `/${id}`) + location.searchStr;
    navigate({ href: next });
  }

  const homeActive = pathname === `/${lang}`;
  const rankActive = pathname.startsWith(`/${lang}/rank`);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-5 md:px-10 lg:px-20">
          <div className="flex min-w-0 items-center gap-6">
            <Link to="/$lang" params={{ lang }} className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-[10px] bg-ink text-lg font-bold text-on-ink">提</span>
              <span className="truncate text-xl">
                <span className="font-bold">提词所</span>
                <span className="font-display font-semibold"> Prompt Lab</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              <Link to="/$lang" params={{ lang }} className={`rounded-lg px-3 py-1.5 text-sm ${homeActive ? "text-ink" : "text-mute"}`}>
                {tx(lang, "首页", "Home")}
              </Link>
              <div className="relative">
                <button type="button" className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-mute" onClick={() => setCatOpen((v) => !v)}>
                  {tx(lang, "分类", "Categories")}
                  <ChevronDown className="size-3.5" aria-hidden />
                </button>
                {catOpen ? (
                  <div className="absolute top-10 left-0 z-50 max-h-[70vh] w-64 overflow-auto rounded-panel border border-line bg-surface p-2">
                    <Link to="/$lang/categories" params={{ lang }} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-chip">
                      {tx(lang, "全部分类", "All categories")}
                    </Link>
                    {categories.map((cat) => (
                      <Link key={cat.id} to="/$lang/c/$slug" params={{ lang, slug: cat.id }} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-chip">
                        {catName(cat, lang)}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
              <Link to="/$lang/rank" params={{ lang }} className={`rounded-lg px-3 py-1.5 text-sm ${rankActive ? "text-ink" : "text-mute"}`}>
                {tx(lang, "投票榜", "Top voted")}
              </Link>
              <button type="button" className="rounded-lg px-3 py-1.5 text-sm text-mute" onClick={() => setSortOpen(true)}>
                {tx(lang, "排序说明", "Ranking")}
              </button>
              <Link to="/$lang/submit" params={{ lang }} className="rounded-lg px-3 py-1.5 text-sm text-mute">
                {tx(lang, "投稿", "Submit")}
              </Link>
              <Link to="/$lang/saved" params={{ lang }} className="rounded-lg px-3 py-1.5 text-sm text-mute">
                {tx(lang, "我的收藏", "Saved")}
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={goSearch} className="hidden h-9 w-60 items-center gap-2 rounded-full border border-line-2 bg-surface px-3 md:flex">
              <Search className="size-4 text-mute" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={tx(lang, "搜索名称、分类或 @作者", "Search prompts or @authors")}
                className="w-full bg-transparent text-fine text-ink outline-none placeholder:text-mute"
                aria-label={tx(lang, "搜索", "Search")}
              />
            </form>
            <div className="relative hidden sm:block">
              <button type="button" onClick={() => setLangOpen((v) => !v)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-2 px-3 text-fine text-ink">
                <Globe className="size-4" aria-hidden />
                {localeLabel(lang)}
              </button>
              {langOpen ? (
                <div className="absolute top-11 right-0 z-50 w-44 rounded-panel border border-line bg-surface p-1">
                  {LOCALES.map((loc) => (
                    <button key={loc.id} type="button" onClick={() => switchLang(loc.id)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-chip">
                      <span>{loc.name}</span>
                      {!loc.live ? <span className="text-fine text-mute">{tx(lang, "即将上线", "Soon")}</span> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {user ? (
              <div className="relative hidden sm:block">
                <button type="button" onClick={() => setAvatarOpen((v) => !v)} className="grid size-9 place-items-center rounded-full bg-chip text-sm font-bold" aria-label={user.name}>
                  {user.name.slice(0, 1).toUpperCase()}
                </button>
                {avatarOpen ? (
                  <div className="absolute top-11 right-0 z-50 w-48 rounded-panel border border-line bg-surface p-1">
                    <Link to="/$lang/saved" params={{ lang }} className="block rounded-lg px-3 py-2 text-sm hover:bg-chip">
                      {tx(lang, "我的收藏", "Saved")}
                    </Link>
                    {user.role === "admin" ? (
                      <Link to="/$lang/admin" params={{ lang }} className="block rounded-lg px-3 py-2 text-sm hover:bg-chip">
                        {tx(lang, "后台管理", "Admin")}
                      </Link>
                    ) : null}
                    <button type="button" onClick={() => logout()} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-chip">
                      {tx(lang, "退出登录", "Sign out")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link to="/$lang/login" params={{ lang }} search={{ next: pathname }} className="hidden h-9 items-center rounded-control bg-ink px-4 text-sm font-medium text-on-ink sm:inline-flex">
                {tx(lang, "登录", "Sign in")}
              </Link>
            )}
            <button type="button" className="grid size-11 place-items-center lg:hidden" aria-label={tx(lang, "菜单", "Menu")} onClick={() => setMenu(true)}>
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>
      {menu ? (
        <div className="fixed inset-0 z-50 bg-bg lg:hidden">
          <div className="flex h-[72px] items-center justify-between px-5">
            <span className="font-bold">提词所</span>
            <button type="button" className="grid size-11 place-items-center" aria-label={tx(lang, "关闭", "Close")} onClick={() => setMenu(false)}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-1 px-4">
            <form onSubmit={goSearch} className="mb-3 flex h-12 items-center gap-2 rounded-control border border-line-2 bg-surface px-3">
              <Search className="size-4 text-mute" aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx(lang, "搜索", "Search")} className="w-full bg-transparent text-body outline-none" />
            </form>
            {[
              [tx(lang, "首页", "Home"), `/${lang}`],
              [tx(lang, "全部分类", "All categories"), `/${lang}/categories`],
              [tx(lang, "投票榜", "Top voted"), `/${lang}/rank`],
              [tx(lang, "投稿", "Submit"), `/${lang}/submit`],
              [tx(lang, "我的收藏", "Saved"), `/${lang}/saved`],
            ].map(([label, href]) => (
              <button key={href} type="button" className="h-12 rounded-lg px-3 text-left text-lead" onClick={() => navigate({ href })}>
                {label}
              </button>
            ))}
            <button type="button" className="h-12 rounded-lg px-3 text-left text-lead" onClick={() => { setMenu(false); setSortOpen(true); }}>
              {tx(lang, "排序说明", "Ranking")}
            </button>
            <p className="mt-4 px-3 text-fine text-mute">{tx(lang, "语言", "Language")}</p>
            {LOCALES.map((loc) => (
              <button key={loc.id} type="button" onClick={() => switchLang(loc.id)} className="flex h-11 items-center justify-between px-3 text-left text-body">
                <span>{loc.name}</span>
                {!loc.live ? <span className="text-fine text-mute">{tx(lang, "即将上线", "Soon")}</span> : null}
              </button>
            ))}
            <div className="mt-4 border-t border-line pt-4">
              {user ? (
                <button type="button" className="h-12 px-3 text-left" onClick={() => { logout(); setMenu(false); }}>
                  {tx(lang, "退出登录", "Sign out")}
                </button>
              ) : (
                <Link to="/$lang/login" params={{ lang }} search={{ next: pathname }} className="inline-flex h-11 items-center rounded-control bg-ink px-5 text-on-ink">
                  {tx(lang, "登录", "Sign in")}
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <main>{children}</main>
      <footer className="border-t border-line px-5 py-12 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="inline-flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-ink text-sm font-bold text-on-ink">提</span>
              <span className="font-bold">提词所 <span className="font-display font-semibold">Prompt Lab</span></span>
            </span>
            <span className="text-sm text-mute">{tx(lang, "邀请制 AI 提示词库 · 独立站点", "Invite-only AI prompt library")}</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute">
            <Link to="/$lang/page/$page" params={{ lang, page: "guide" }}>{tx(lang, "使用说明", "Guide")}</Link>
            <Link to="/$lang/page/$page" params={{ lang, page: "rules" }}>{tx(lang, "投稿规范", "Submission rules")}</Link>
            <button type="button" onClick={() => setSortOpen(true)}>{tx(lang, "排序说明", "Ranking")}</button>
            <Link to="/$lang/page/$page" params={{ lang, page: "privacy" }}>{tx(lang, "隐私政策", "Privacy")}</Link>
            <Link to="/$lang/page/$page" params={{ lang, page: "contact" }}>{tx(lang, "联系管理员", "Contact admin")}</Link>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-[1280px] text-fine text-mute">
          {tx(lang, "© 2026 提词所 Prompt Lab · 缩略图来自 Pixabay（免费商用授权）及同风格示例图，仅用于提示类型", "© 2026 Prompt Lab · Thumbnails are sample images for prompt types only")}
        </p>
      </footer>
      <SortDialog lang={lang} />
      <GateDialog lang={lang} />
      <Toast />
    </div>
  );
}
