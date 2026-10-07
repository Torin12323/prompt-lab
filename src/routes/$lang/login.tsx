import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MOSAIC } from "@/lib/catalog";
import { safeNext } from "@/lib/format";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { ADMIN_EMAIL, useApp } from "@/lib/store";

export const Route = createFileRoute("/$lang/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : "",
  }),
  component: LoginPage,
});

function LoginPage() {
  const { lang: raw } = Route.useParams();
  const { next } = Route.useSearch();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const navigate = useNavigate();
  const login = useApp((s) => s.login);
  const setAdminPassword = useApp((s) => s.setAdminPassword);
  const ready = useApp((s) => s.ready);
  const adminSet = useApp((s) => s.users.some((u) => u.id === "u-admin" && u.password !== ""));
  const loginByPhone = useApp((s) => s.loginByPhone);
  const showToast = useApp((s) => s.showToast);
  const [tab, setTab] = useState<"password" | "code">("password");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [confirm, setConfirm] = useState("");
  const [reveal, setReveal] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");

  function finish() {
    navigate({ href: safeNext(next, `/${lang}`) });
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-surface p-16 lg:flex">
        <div>
          <h2 className="max-w-sm text-title font-bold">{tx(lang, "邀请制提示词库", "An invite-only prompt library")}</h2>
          <p className="mt-3 max-w-sm text-mute">{tx(lang, "浏览公开，复制与投票需要成员身份。", "Browse openly. Copying and voting need a membership.")}</p>
        </div>
        <div className="grid max-w-md grid-cols-4 gap-3">
          {MOSAIC.map((src) => (
            <img key={src} src={src} alt="" className="aspect-square rounded-control object-cover" />
          ))}
        </div>
        <p className="text-fine text-mute">{tx(lang, "图源 · 示例图", "Sample images")}</p>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px]">
          <Link to="/$lang" params={{ lang }} className="inline-flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-[10px] bg-ink font-bold text-on-ink">提</span>
            <span className="text-xl font-bold">提词所 <span className="font-display font-semibold">Prompt Lab</span></span>
          </Link>
          <h1 className="mt-8 text-3xl font-bold">{tx(lang, "登录提词所", "Sign in")}</h1>
          {!ready ? <p className="mt-4 text-sm text-mute">{tx(lang, "正在准备安全输入…", "Preparing a private input…")}</p> : null}
          {ready && !adminSet ? (
            <form
              className="mt-6 flex flex-col gap-4 rounded-panel border border-line bg-surface p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (secret.length < 8) {
                  setError(tx(lang, "管理员密码至少 8 位。", "Use at least 8 characters."));
                  return;
                }
                if (secret === "promptlab") {
                  setError(tx(lang, "不能使用已经公开的示例密码。", "Don't reuse the published sample password."));
                  return;
                }
                if (secret !== confirm) {
                  setError(tx(lang, "两次输入不一致。", "The two passwords don't match."));
                  return;
                }
                void (async () => {
                  await setAdminPassword(secret);
                  setSecret("");
                  setConfirm("");
                  showToast(tx(lang, "管理员密码已保存在这台浏览器", "Admin password saved in this browser"));
                  navigate({ href: `/${lang}/admin` });
                })();
              }}
            >
              <div>
                <h2 className="text-lg font-bold">{tx(lang, "设置管理员密码", "Set the admin password")}</h2>
                <p className="mt-1 text-fine text-mute">
                  {tx(
                    lang,
                    "邮箱已锁定。密码只在这台浏览器里哈希保存，不会发到对话、服务器或 GitHub。请在下面填写。",
                    "The email is locked. The password is hashed in this browser only. It is not sent to chat, a server, or GitHub.",
                  )}
                </p>
              </div>
              <label className="flex flex-col gap-2 text-sm">
                {tx(lang, "管理员邮箱", "Admin email")}
                <input value={ADMIN_EMAIL} readOnly className="h-12 rounded-control border border-line bg-bg px-4 text-mute outline-none" />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                {tx(lang, "管理员密码", "Admin password")}
                <input
                  type={reveal ? "text" : "password"}
                  name="new-password"
                  autoComplete="new-password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="h-12 rounded-control border border-line-2 bg-bg px-4 outline-none focus:border-ink"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                {tx(lang, "再次输入", "Confirm password")}
                <input
                  type={reveal ? "text" : "password"}
                  name="confirm-password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-12 rounded-control border border-line-2 bg-bg px-4 outline-none focus:border-ink"
                />
              </label>
              <label className="flex items-center gap-2 text-fine text-mute">
                <input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} />
                {tx(lang, "显示密码，便于核对", "Show the password while checking it")}
              </label>
              {error ? <p className="text-fine text-danger">{error}</p> : null}
              <button type="submit" className="h-11 rounded-control bg-ink font-medium text-on-ink">{tx(lang, "保存并进入后台", "Save and open admin")}</button>
            </form>
          ) : null}
          <p className="mt-6 text-body text-mute">{tx(lang, "欢迎回来。登录后可复制提示词、投票和收藏。", "Welcome back. Sign in to copy, vote and save.")}</p>
          <div className="mt-6 flex gap-6 border-b border-line">
            <button type="button" onClick={() => setTab("password")} className={`pb-3 ${tab === "password" ? "border-b-2 border-ink" : "text-mute"}`}>{tx(lang, "密码登录", "Password")}</button>
            <button type="button" onClick={() => setTab("code")} className={`pb-3 ${tab === "code" ? "border-b-2 border-ink" : "text-mute"}`}>{tx(lang, "验证码登录", "Code")}</button>
          </div>
          {tab === "password" ? (
            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                void (async () => {
                  if (!adminSet && account.trim().toLowerCase() === ADMIN_EMAIL) {
                    setError(tx(lang, "请先在上方设置管理员密码。", "Set the admin password above first."));
                    return;
                  }
                  const user = await login(account, password);
                  if (!user) {
                    setError(tx(lang, "邮箱、手机号或密码不正确。", "Email, phone or password is incorrect."));
                    return;
                  }
                  finish();
                })();
              }}
            >
              <label className="flex flex-col gap-2 text-sm">
                {tx(lang, "邮箱或手机号", "Email or phone")}
                <input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="a@example.com" className="h-12 rounded-control border border-line-2 bg-surface px-4 outline-none focus:border-ink" />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                {tx(lang, "密码", "Password")}
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 rounded-control border border-line-2 bg-surface px-4 outline-none focus:border-ink" />
                <span className="text-fine text-mute">{tx(lang, "忘记密码？请联系管理员重置", "Forgot it? Ask an admin to reset it.")}</span>
              </label>
              {error ? <p className="text-fine text-danger">{error}</p> : null}
              <button type="submit" className="h-11 rounded-control bg-ink font-medium text-on-ink">{tx(lang, "登录", "Sign in")}</button>
            </form>
          ) : (
            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (code.trim() !== "246810") {
                  setError(tx(lang, "验证码不正确。", "That code is incorrect."));
                  return;
                }
                const user = loginByPhone(phone);
                if (!user) {
                  setError(tx(lang, "没有找到这个手机号。", "No account uses that phone."));
                  return;
                }
                finish();
              }}
            >
              <label className="flex flex-col gap-2 text-sm">
                {tx(lang, "手机号", "Phone")}
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="13800138000" className="h-12 rounded-control border border-line-2 bg-surface px-4 outline-none focus:border-ink" />
              </label>
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={tx(lang, "6 位验证码", "6-digit code")} className="h-12 flex-1 rounded-control border border-line-2 bg-surface px-4 outline-none focus:border-ink" />
                <button
                  type="button"
                  disabled={seconds > 0}
                  onClick={() => {
                    setSent(true);
                    setSeconds(60);
                    showToast(tx(lang, "演示验证码 246810", "Demo code 246810"));
                    const timer = window.setInterval(() => {
                      setSeconds((n) => {
                        if (n <= 1) {
                          window.clearInterval(timer);
                          return 0;
                        }
                        return n - 1;
                      });
                    }, 1000);
                  }}
                  className="h-12 rounded-control border border-line-2 px-3 text-sm disabled:opacity-50"
                >
                  {seconds > 0 ? `${seconds}s` : tx(lang, "获取验证码", "Send code")}
                </button>
              </div>
              {sent ? <p className="text-fine text-mute">{tx(lang, "演示环境不会真正发短信。验证码是 246810。", "This demo does not send SMS. The code is 246810.")}</p> : null}
              {error ? <p className="text-fine text-danger">{error}</p> : null}
              <button type="submit" className="h-11 rounded-control bg-ink font-medium text-on-ink">{tx(lang, "登录", "Sign in")}</button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-mute">
            {tx(lang, "还没有账号？", "No account yet?")}{" "}
            <Link to="/$lang/register" params={{ lang }} className="font-medium text-ink">{tx(lang, "邀请码注册", "Register with an invite")}</Link>
          </p>
          <p className="mt-6 rounded-panel bg-chip p-3 text-fine text-mute">
            {tx(lang, "示例成员 moxi@promptlab.example / promptlab。管理员邮箱已锁定，密码只在本机设置，不会写在页面上。邀请码 PLAB-2026。", "Sample member moxi@promptlab.example / promptlab. The admin email is locked; its password is set on this device and is not printed here. Invite PLAB-2026.")}
          </p>
        </div>
      </div>
    </div>
  );
}
