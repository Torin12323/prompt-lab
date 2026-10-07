import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/$lang/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { lang: raw } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const navigate = useNavigate();
  const register = useApp((s) => s.register);
  const settings = useApp((s) => s.settings);
  const invites = useApp((s) => s.invites);
  const showToast = useApp((s) => s.showToast);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [phone, setPhone] = useState("");
  const [sms, setSms] = useState("");
  const [sent, setSent] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  function checkCode() {
    if (!settings.inviteRequired) {
      setCodeError("");
      setStep(settings.phoneVerify ? 2 : 3);
      return;
    }
    const invite = invites.find((i) => i.code.toLowerCase() === code.trim().toLowerCase());
    if (!invite) return setCodeError(tx(lang, "邀请码无效", "Invite invalid"));
    if (invite.status === "used") return setCodeError(tx(lang, "邀请码已使用", "Invite already used"));
    if (invite.status === "expired") return setCodeError(tx(lang, "邀请码已过期", "Invite expired"));
    if (invite.status === "void") return setCodeError(tx(lang, "邀请码已作废", "Invite revoked"));
    setCodeError("");
    setStep(settings.phoneVerify ? 2 : 3);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md flex-col justify-center px-5 py-12">
      <Link to="/$lang" params={{ lang }} className="inline-flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-[10px] bg-ink font-bold text-on-ink">提</span>
        <span className="font-bold">提词所 Prompt Lab</span>
      </Link>
      <p className="mt-8 text-fine text-mute">{tx(lang, `第 ${step} 步 / 共 3 步`, `Step ${step} of 3`)}</p>
      <h1 className="mt-2 text-3xl font-bold">
        {step === 1 ? tx(lang, "输入邀请码", "Enter an invite") : step === 2 ? tx(lang, "验证手机号", "Verify your phone") : tx(lang, "邮箱与密码", "Email and password")}
      </h1>
      <p className="mt-2 text-body text-mute">
        {step === 1
          ? tx(lang, "注册先校验邀请码，再验证手机号。", "Invites are checked first, then the phone.")
          : step === 2
            ? tx(lang, "邀请码已校验。演示验证码是 246810。", "Invite accepted. The demo code is 246810.")
            : tx(lang, "完成后即可复制提示词、投票和收藏。", "Then you can copy, vote and save.")}
      </p>
      {step === 1 ? (
        <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); checkCode(); }}>
          <label className="flex flex-col gap-2 text-sm">
            {tx(lang, "邀请码", "Invite code")}
            <input value={code} onChange={(e) => { setCode(e.target.value); setCodeError(""); }} placeholder="PLAB-2026" className={`h-12 rounded-control border bg-surface px-4 outline-none ${codeError ? "border-danger" : "border-line-2 focus:border-ink"}`} />
          </label>
          {codeError ? <p className="text-fine text-danger">{codeError}</p> : <p className="text-fine text-mute">{tx(lang, "示例可用邀请码 PLAB-2026。PLAB-USED / PLAB-OLD 用于查看错误状态。", "Sample invite PLAB-2026. PLAB-USED and PLAB-OLD show the error states.")}</p>}
          <button type="submit" disabled={Boolean(codeError) || !code.trim()} className="h-11 rounded-control bg-ink font-medium text-on-ink disabled:opacity-40">{tx(lang, "下一步", "Next")}</button>
        </form>
      ) : null}
      {step === 2 ? (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^1\d{10}$/.test(phone.trim())) {
              setFormError(tx(lang, "请输入 +86 的 11 位手机号。", "Enter an 11-digit +86 phone number."));
              return;
            }
            if (sms.trim() !== "246810") {
              setFormError(tx(lang, "验证码不正确。", "That code is incorrect."));
              return;
            }
            setFormError("");
            setStep(3);
          }}
        >
          <label className="flex flex-col gap-2 text-sm">
            +86
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="13800138000" className="h-12 rounded-control border border-line-2 bg-surface px-4 outline-none focus:border-ink" />
          </label>
          <div className="flex gap-2">
            <input value={sms} onChange={(e) => setSms(e.target.value)} className="h-12 flex-1 rounded-control border border-line-2 bg-surface px-4 outline-none" placeholder="246810" />
            <button
              type="button"
              disabled={seconds > 0}
              className="h-12 rounded-control border border-line-2 px-3 text-sm disabled:opacity-50"
              onClick={() => {
                setSent(true);
                setSeconds(60);
                showToast(tx(lang, "验证码已发送 · 246810", "Code sent · 246810"));
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
            >
              {seconds > 0 ? `${seconds}s` : tx(lang, "发送验证码", "Send code")}
            </button>
          </div>
          {sent ? <p className="text-fine text-mute">{tx(lang, "验证码已发送，正在倒计时。", "Code sent. Countdown running.")}</p> : null}
          {formError ? <p className="text-fine text-danger">{formError}</p> : null}
          <button type="submit" className="h-11 rounded-control bg-ink font-medium text-on-ink">{tx(lang, "下一步", "Next")}</button>
        </form>
      ) : null}
      {step === 3 ? (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@") || password.length < 6) {
              setFormError(tx(lang, "请填写有效邮箱，密码至少 6 位。", "Use a valid email and a password of at least 6 characters."));
              return;
            }
            const result = register({ name, email, phone, password, code });
            if (result === "email") return setFormError(tx(lang, "这个邮箱已经注册。", "That email is already registered."));
            if (result) return setFormError(result);
            navigate({ to: "/$lang", params: { lang } });
          }}
        >
          <label className="flex flex-col gap-2 text-sm">
            {tx(lang, "昵称", "Name")}
            <input value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-control border border-line-2 bg-surface px-4 outline-none" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            {tx(lang, "邮箱", "Email")}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="a@example.com" className="h-12 rounded-control border border-line-2 bg-surface px-4 outline-none" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            {tx(lang, "密码", "Password")}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-control border border-line-2 bg-surface px-4 outline-none" />
          </label>
          {formError ? <p className="text-fine text-danger">{formError}</p> : null}
          <button type="submit" className="h-11 rounded-control bg-ink font-medium text-on-ink">{tx(lang, "完成注册", "Create account")}</button>
        </form>
      ) : null}
      <p className="mt-6 text-sm text-mute">
        {tx(lang, "已有账号？", "Already a member?")}{" "}
        <Link to="/$lang/login" params={{ lang }} search={{ next: "" }} className="text-ink">{tx(lang, "登录", "Sign in")}</Link>
      </p>
    </div>
  );
}
