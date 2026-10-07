import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { isUiLang, tx, type UiLang } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/$lang/page/$page")({
  component: InfoPage,
});

function InfoPage() {
  const { lang: raw, page } = Route.useParams();
  const lang: UiLang = isUiLang(raw) ? raw : "zh-CN";
  const showToast = useApp((s) => s.showToast);
  const [note, setNote] = useState("");
  const copy = pages[page] ?? pages.guide;
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 md:px-10">
      <p className="text-fine text-mute">
        <Link to="/$lang" params={{ lang }}>{tx(lang, "首页", "Home")}</Link>
      </p>
      <h1 className="mt-4 text-title font-bold">{tx(lang, copy.zhTitle, copy.enTitle)}</h1>
      {copy.body.map((p) => (
        <p key={p.zh} className="mt-4 text-body text-mute">{tx(lang, p.zh, p.en)}</p>
      ))}
      {page === "contact" ? (
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            setNote("");
            showToast(tx(lang, "已发给管理员", "Sent to the admin"));
          }}
        >
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} className="rounded-control border border-line-2 bg-surface px-4 py-3 outline-none" placeholder={tx(lang, "写给管理员", "Note to the admin")} />
          <button type="submit" className="h-11 w-fit rounded-control bg-ink px-5 font-medium text-on-ink">{tx(lang, "发送", "Send")}</button>
        </form>
      ) : null}
    </article>
  );
}

const pages: Record<string, { zhTitle: string; enTitle: string; body: { zh: string; en: string }[] }> = {
  guide: {
    zhTitle: "使用说明",
    enTitle: "Guide",
    body: [
      { zh: "未登录可以浏览首页、分类和卡片预览。复制完整提示词、投票、收藏和查看原图需要登录。", en: "Signed-out visitors can browse the home page, categories and card previews. Copying a full prompt, voting, saving and opening the original image need a sign-in." },
      { zh: "排序只看投票。票数相同按发布时间，新的在前。收藏和复制次数不参与排名。", en: "Rank uses votes only. Ties break by publish time, newest first. Saves and copies do not count." },
      { zh: "示例账号、邀请码和投票数都是示例数据，方便走完注册、投稿和管理流程。", en: "The sample account, invite and vote counts are sample data so you can walk through register, submit and admin." },
    ],
  },
  rules: {
    zhTitle: "投稿规范",
    enTitle: "Submission rules",
    body: [
      { zh: "只投稿自己撰写或有权分享的提示词。不要包含名人肖像、商标、水印或他人的私密信息。", en: "Submit only prompts you wrote or have the right to share. Do not include celebrity likenesses, trademarks, watermarks or someone else’s private data." },
      { zh: "正向、反向和参数请分开写。标题用一句话说清可替换的主体。", en: "Keep positive, negative and parameters apart. The title should say what can be swapped." },
      { zh: "发布后仅对受邀成员可见。草稿留在「我的收藏 · 草稿」。", en: "Published prompts stay inside the invite-only library. Drafts live under Saved · Drafts." },
    ],
  },
  privacy: {
    zhTitle: "隐私政策",
    enTitle: "Privacy",
    body: [
      { zh: "这个演示把账号、投票、收藏和邀请码保存在你的浏览器里，不会上传到服务器。", en: "This demo keeps accounts, votes, saves and invites in your browser. They are not uploaded." },
      { zh: "管理员密码在这台浏览器里做哈希后保存，不会上传。清除站点数据后需要重新设置。示例成员密码仍是演示用，不要把常用密码填进去。", en: "The admin password is hashed in this browser and is not uploaded. Clearing site data means setting it again. The sample member password is only a demo — don't reuse a password you use elsewhere." },
    ],
  },
  contact: {
    zhTitle: "联系管理员",
    enTitle: "Contact admin",
    body: [
      { zh: "忘记密码、邀请码异常或需要作废一批码，写在下面。演示里会显示已发送，不会真的寄出邮件。", en: "Password resets, bad invites or a batch revoke go here. The demo only confirms the send. No email leaves the browser." },
    ],
  },
};
