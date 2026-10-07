import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { ADMIN_EMAIL, useApp, type InviteStatus } from "@/lib/store";

export const Route = createFileRoute("/$lang/admin")({
  component: AdminPage,
});

const FILTERS: { id: "all" | InviteStatus; zh: string; en: string }[] = [
  { id: "all", zh: "全部", en: "All" },
  { id: "unused", zh: "未使用", en: "Unused" },
  { id: "used", zh: "已使用", en: "Used" },
  { id: "void", zh: "已作废", en: "Revoked" },
  { id: "expired", zh: "已过期", en: "Expired" },
];

function AdminPage() {
  const { lang: raw } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const user = useApp((s) => s.current());
  const ready = useApp((s) => s.ready);
  const invites = useApp((s) => s.invites);
  const settings = useApp((s) => s.settings);
  const updateSettings = useApp((s) => s.updateSettings);
  const saveSettings = useApp((s) => s.saveSettings);
  const restoreSettings = useApp((s) => s.restoreSettings);
  const addInvites = useApp((s) => s.addInvites);
  const voidInvites = useApp((s) => s.voidInvites);
  const showToast = useApp((s) => s.showToast);
  const [panel, setPanel] = useState<"codes" | "settings">("codes");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(4);
  const rows = useMemo(() => invites.filter((i) => filter === "all" || i.status === filter), [invites, filter]);

  if (!ready) return <div className="px-5 py-16 text-mute">{tx(lang, "正在读取权限…", "Checking access…")}</div>;
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20">
        <h1 className="text-title font-bold">{tx(lang, "后台管理", "Admin")}</h1>
        <Link to="/$lang/login" params={{ lang }} search={{ next: `/${lang}/admin` }} className="mt-4 inline-flex h-11 items-center rounded-control bg-ink px-5 text-on-ink">{tx(lang, "登录", "Sign in")}</Link>
      </div>
    );
  }
  if (user.role !== "admin") {
    return <div className="mx-auto max-w-lg px-5 py-20 text-mute">{tx(lang, "仅管理员可进入。", "Admins only.")}</div>;
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 md:px-10 lg:grid-cols-[220px_1fr] lg:px-20">
      <aside className="flex gap-2 lg:flex-col">
        <button type="button" onClick={() => setPanel("codes")} className={`h-11 rounded-control px-3 text-left ${panel === "codes" ? "bg-chip" : "text-mute"}`}>{tx(lang, "邀请码", "Invites")}</button>
        <button type="button" onClick={() => setPanel("settings")} className={`h-11 rounded-control px-3 text-left ${panel === "settings" ? "bg-chip" : "text-mute"}`}>{tx(lang, "站点设置", "Settings")}</button>
      </aside>
      {panel === "codes" ? (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-title font-bold">{tx(lang, "邀请码", "Invite codes")}</h1>
            <div className="flex gap-2">
              <button type="button" onClick={() => setOpen(true)} className="h-11 rounded-control bg-ink px-4 font-medium text-on-ink">{tx(lang, "生成邀请码", "Generate")}</button>
              <button
                type="button"
                disabled={picked.length === 0}
                onClick={() => {
                  voidInvites(picked);
                  setPicked([]);
                  showToast(tx(lang, "已撤销所选邀请码", "Selected invites revoked"));
                }}
                className="h-11 rounded-control border border-line-2 px-4 disabled:opacity-40"
              >
                {tx(lang, "作废所选", "Revoke selected")}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`h-10 rounded-full border px-3 text-sm ${filter === f.id ? "border-ink" : "border-line-2 text-mute"}`}>
                {lang === "en" ? f.en : f.zh}
              </button>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-panel border border-line">
            {rows.map((invite) => (
              <label key={invite.code} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                <input
                  type="checkbox"
                  checked={picked.includes(invite.code)}
                  onChange={(e) => setPicked((cur) => e.target.checked ? [...cur, invite.code] : cur.filter((c) => c !== invite.code))}
                  className="size-4"
                />
                <span className="font-mono">{invite.code}</span>
                <span className="text-fine text-mute">{statusLabel(invite.status, lang)}</span>
                <span className="ml-auto text-fine text-mute">{invite.createdAt}</span>
              </label>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-xl">
          <h1 className="text-title font-bold">{tx(lang, "站点设置", "Site settings")}</h1>
          <div className="mt-6 flex flex-col gap-4">
            <Toggle label={tx(lang, "开放注册", "Registration open")} on={settings.registrationOpen} onChange={(v) => updateSettings({ registrationOpen: v })} />
            <Toggle label={tx(lang, "邀请码必填", "Invite required")} on={settings.inviteRequired} onChange={(v) => updateSettings({ inviteRequired: v })} />
            <Toggle label={tx(lang, "手机号验证", "Phone verification")} on={settings.phoneVerify} onChange={(v) => updateSettings({ phoneVerify: v })} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => { saveSettings(); showToast(tx(lang, "设置已保存", "Settings saved")); }} className="h-11 rounded-control bg-ink px-4 text-on-ink">{tx(lang, "保存", "Save")}</button>
            <button type="button" onClick={() => { restoreSettings(); showToast(tx(lang, "已恢复为上次保存的设置", "Restored the last saved settings")); }} className="h-11 rounded-control border border-line-2 px-4">{tx(lang, "恢复", "Restore")}</button>
            <button type="button" onClick={() => showToast(tx(lang, `管理员邮箱已锁定为 ${ADMIN_EMAIL}`, `Admin email is locked to ${ADMIN_EMAIL}`))} className="h-11 rounded-control border border-line-2 px-4">{tx(lang, "管理员邮箱", "Admin email")}</button>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText("PLAB-BACKUP-8841");
                showToast(tx(lang, "备用码已复制到剪贴板", "Backup code copied"));
              }}
              className="h-11 rounded-control border border-line-2 px-4"
            >
              {tx(lang, "复制备用码", "Copy backup code")}
            </button>
          </div>
        </section>
      )}
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button type="button" className="absolute inset-0 bg-scrim" onClick={() => setOpen(false)} aria-label={tx(lang, "关闭", "Close")} />
          <form
            className="relative w-full max-w-md rounded-[20px] border border-line bg-surface p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const n = Math.min(20, Math.max(1, count));
              const codes = Array.from({ length: n }, () => `PLAB-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
              addInvites(codes);
              void navigator.clipboard.writeText(codes.join("\n"));
              setOpen(false);
              showToast(tx(lang, "邀请码已生成并复制", "Invites generated and copied"));
            }}
          >
            <h2 className="text-2xl font-bold">{tx(lang, "生成邀请码", "Generate invites")}</h2>
            <label className="mt-4 flex flex-col gap-2 text-sm">
              {tx(lang, "数量", "Count")}
              <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="h-12 rounded-control border border-line-2 bg-bg px-3" />
            </label>
            <button type="submit" className="mt-4 h-11 w-full rounded-full bg-ink font-medium text-on-ink">{tx(lang, "生成并复制", "Generate and copy")}</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function statusLabel(status: InviteStatus, lang: UiLang) {
  const map = {
    unused: ["未使用", "Unused"],
    used: ["已使用", "Used"],
    void: ["已作废", "Revoked"],
    expired: ["已过期", "Expired"],
  } as const;
  return tx(lang, map[status][0], map[status][1]);
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-panel border border-line px-4 py-3">
      <span>{label}</span>
      <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={`h-6 w-11 rounded-full p-0.5 ${on ? "bg-ink" : "bg-chip"}`}>
        <span className={`block size-5 rounded-full bg-bg ${on ? "ml-auto" : ""}`} />
      </button>
    </label>
  );
}
