import { Link, useRouterState } from "@tanstack/react-router";
import type { UiLang } from "@/lib/i18n";
import { tx } from "@/lib/i18n";
import { useApp } from "@/lib/store";

const RULES = [
  ["只按投票数排序：每条提示词的位置只由社区投票数决定。", "Rank uses votes only. A prompt’s place is decided by community votes."],
  ["票数相同时按发布时间，新发布的在前。", "Ties break by publish time, newest first."],
  ["收藏是个人功能，收藏与复制次数都不参与排名。", "Saves are personal. Saves and copies do not affect rank."],
  ["每位成员对每条提示词只能投一票，可随时撤回。", "Each member has one vote per prompt and can take it back."],
  ["本站不对提示词效果做评测或推荐。", "This site does not grade or recommend prompt results."],
] as const;

export function SortDialog({ lang }: { lang: UiLang }) {
  const open = useApp((s) => s.sortOpen);
  const setOpen = useApp((s) => s.setSortOpen);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" className="absolute inset-0 bg-scrim" aria-label={tx(lang, "关闭", "Close")} onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl rounded-[20px] border border-line bg-surface px-8 py-7 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        <h2 className="text-2xl font-bold leading-snug">{tx(lang, "排序说明", "How ranking works")}</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {RULES.map((rule, i) => (
            <li key={rule[0]} className="flex gap-2.5 text-body text-ink">
              <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-chip font-display text-xs">{i + 1}</span>
              <span>{tx(lang, rule[0], rule[1])}</span>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => setOpen(false)} className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-ink text-body font-medium text-on-ink">
          {tx(lang, "知道了", "Got it")}
        </button>
      </div>
    </div>
  );
}

export function GateDialog({ lang }: { lang: UiLang }) {
  const open = useApp((s) => s.gateOpen);
  const setOpen = useApp((s) => s.setGateOpen);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  if (!open) return null;
  const next = `${pathname}${searchStr}`;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" className="absolute inset-0 bg-scrim" aria-label={tx(lang, "关闭", "Close")} onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-[20px] border border-line bg-surface px-8 py-7">
        <h2 className="text-2xl font-bold">{tx(lang, "登录后继续", "Sign in to continue")}</h2>
        <p className="mt-2 text-body text-mute">
          {tx(lang, "未登录可以浏览。复制完整提示词、投票、收藏和查看原图需要登录。", "You can browse while signed out. Copying a full prompt, voting, saving and viewing the original image need a sign-in.")}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link to="/$lang/login" params={{ lang }} search={{ next }} onClick={() => setOpen(false)} className="flex h-11 items-center justify-center rounded-control bg-ink text-body font-medium text-on-ink">
            {tx(lang, "登录", "Sign in")}
          </Link>
          <Link to="/$lang/register" params={{ lang }} onClick={() => setOpen(false)} className="flex h-11 items-center justify-center rounded-control border border-line-2 text-body text-ink">
            {tx(lang, "邀请码注册", "Register with an invite")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Toast() {
  const toast = useApp((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-fine font-medium text-on-ink">
      {toast}
    </div>
  );
}
