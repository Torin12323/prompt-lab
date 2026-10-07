import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useMemo } from "react";
import { prompts, type PromptItem } from "@/lib/catalog";

export type Role = "member" | "admin";

export type Account = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  joined: string;
};

export type InviteStatus = "unused" | "used" | "void" | "expired";

export type Invite = {
  code: string;
  status: InviteStatus;
  note: string;
  createdAt: string;
};

export type Settings = {
  registrationOpen: boolean;
  inviteRequired: boolean;
  phoneVerify: boolean;
};

export type ExtraPrompt = PromptItem & { ownerId: string; status: "published" | "draft" };

type State = {
  ready: boolean;
  userId: string | null;
  users: Account[];
  invites: Invite[];
  deltas: Record<string, number>;
  voted: Record<string, string[]>;
  favs: Record<string, string[]>;
  extras: ExtraPrompt[];
  settings: Settings;
  savedSettings: Settings;
  sortOpen: boolean;
  gateOpen: boolean;
  toast: string | null;
  login: (emailOrPhone: string, password: string) => Account | null;
  loginByPhone: (phone: string) => Account | null;
  register: (input: { name: string; email: string; phone: string; password: string; code: string }) => string | null;
  logout: () => void;
  current: () => Account | null;
  voteOf: (id: string) => number;
  hasVoted: (id: string) => boolean;
  toggleVote: (id: string) => boolean;
  hasFav: (id: string) => boolean;
  toggleFav: (id: string) => boolean;
  published: () => PromptItem[];
  mine: () => ExtraPrompt[];
  drafts: () => ExtraPrompt[];
  addExtra: (item: ExtraPrompt) => void;
  publishDraft: (id: string) => void;
  removeExtra: (id: string) => void;
  setSortOpen: (open: boolean) => void;
  setGateOpen: (open: boolean) => void;
  showToast: (message: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  saveSettings: () => void;
  restoreSettings: () => void;
  addInvites: (codes: string[]) => void;
  voidInvites: (codes: string[]) => void;
};

const seedUsers: Account[] = [
  {
    id: "u-moxi",
    name: "moxi",
    email: "moxi@promptlab.example",
    phone: "13800138000",
    password: "promptlab",
    role: "member",
    joined: "2026-09-01",
  },
  {
    id: "u-admin",
    name: "admin",
    email: "admin@promptlab.example",
    phone: "13900001111",
    password: "promptlab",
    role: "admin",
    joined: "2026-01-08",
  },
];

const seedInvites: Invite[] = [
  { code: "PLAB-2026", status: "unused", note: "示例可用", createdAt: "2026-09-01" },
  { code: "PLAB-USED", status: "used", note: "已使用", createdAt: "2026-06-01" },
  { code: "PLAB-OLD", status: "expired", note: "已过期", createdAt: "2025-12-01" },
  { code: "PLAB-VOID", status: "void", note: "已作废", createdAt: "2026-04-01" },
];

const defaultSettings: Settings = {
  registrationOpen: true,
  inviteRequired: true,
  phoneVerify: true,
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      ready: false,
      userId: null,
      users: seedUsers,
      invites: seedInvites,
      deltas: {},
      voted: {},
      favs: {
        "u-moxi": ["clay", "mech", "white", "street", "hook", "beach", "bottle", "neg-quality"],
      },
      extras: [],
      settings: defaultSettings,
      savedSettings: defaultSettings,
      sortOpen: false,
      gateOpen: false,
      toast: null,
      current: () => get().users.find((u) => u.id === get().userId) ?? null,
      login: (emailOrPhone, password) => {
        const key = emailOrPhone.trim().toLowerCase();
        const user = get().users.find(
          (u) => (u.email.toLowerCase() === key || u.phone === emailOrPhone.trim()) && u.password === password,
        );
        if (!user) return null;
        set({ userId: user.id });
        return user;
      },
      loginByPhone: (phone) => {
        const user = get().users.find((u) => u.phone === phone.trim());
        if (!user) return null;
        set({ userId: user.id });
        return user;
      },
      register: ({ name, email, phone, password, code }) => {
        const settings = get().settings;
        if (!settings.registrationOpen) return "closed";
        if (settings.inviteRequired) {
          const invite = get().invites.find((i) => i.code.toLowerCase() === code.trim().toLowerCase());
          if (!invite) return "invalid";
          if (invite.status === "used") return "used";
          if (invite.status === "expired") return "expired";
          if (invite.status === "void") return "void";
        }
        if (get().users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return "email";
        const id = `u-${Date.now()}`;
        const user: Account = {
          id,
          name: name.trim() || email.split("@")[0] || "member",
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: "member",
          joined: new Date().toISOString().slice(0, 10),
        };
        set({
          users: [...get().users, user],
          userId: id,
          invites: settings.inviteRequired
            ? get().invites.map((i) =>
                i.code.toLowerCase() === code.trim().toLowerCase() ? { ...i, status: "used" as const } : i,
              )
            : get().invites,
        });
        return null;
      },
      logout: () => set({ userId: null }),
      voteOf: (id) => {
        const base = prompts.find((p) => p.id === id)?.votes ?? get().extras.find((p) => p.id === id)?.votes ?? 0;
        return Math.max(0, base + (get().deltas[id] ?? 0));
      },
      hasVoted: (id) => {
        const uid = get().userId;
        if (!uid) return false;
        return (get().voted[uid] ?? []).includes(id);
      },
      toggleVote: (id) => {
        const uid = get().userId;
        if (!uid) return false;
        const list = get().voted[uid] ?? [];
        const on = list.includes(id);
        set({
          voted: { ...get().voted, [uid]: on ? list.filter((x) => x !== id) : [...list, id] },
          deltas: { ...get().deltas, [id]: (get().deltas[id] ?? 0) + (on ? -1 : 1) },
        });
        return true;
      },
      hasFav: (id) => {
        const uid = get().userId;
        if (!uid) return false;
        return (get().favs[uid] ?? []).includes(id);
      },
      toggleFav: (id) => {
        const uid = get().userId;
        if (!uid) return false;
        const list = get().favs[uid] ?? [];
        set({
          favs: { ...get().favs, [uid]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] },
        });
        return true;
      },
      published: () => [...prompts, ...get().extras.filter((e) => e.status === "published")],
      mine: () => {
        const uid = get().userId;
        return get().extras.filter((e) => e.ownerId === uid && e.status === "published");
      },
      drafts: () => {
        const uid = get().userId;
        return get().extras.filter((e) => e.ownerId === uid && e.status === "draft");
      },
      addExtra: (item) => set({ extras: [item, ...get().extras] }),
      publishDraft: (id) =>
        set({
          extras: get().extras.map((e) => (e.id === id ? { ...e, status: "published" as const } : e)),
        }),
      removeExtra: (id) => set({ extras: get().extras.filter((e) => e.id !== id) }),
      setSortOpen: (open) => set({ sortOpen: open }),
      setGateOpen: (open) => set({ gateOpen: open }),
      showToast: (message) => {
        if (toastTimer) clearTimeout(toastTimer);
        set({ toast: message });
        toastTimer = setTimeout(() => set({ toast: null }), 1600);
      },
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      saveSettings: () => {
        set({ savedSettings: get().settings });
      },
      restoreSettings: () => set({ settings: get().savedSettings }),
      addInvites: (codes) => {
        const next = codes.map((code) => ({
          code,
          status: "unused" as const,
          note: "新生成",
          createdAt: new Date().toISOString().slice(0, 10),
        }));
        set({ invites: [...next, ...get().invites] });
      },
      voidInvites: (codes) =>
        set({
          invites: get().invites.map((i) => (codes.includes(i.code) ? { ...i, status: "void" as const } : i)),
        }),
    }),
    {
      name: "promptlab-v1",
      skipHydration: true,
      partialize: (s) => ({
        userId: s.userId,
        users: s.users,
        invites: s.invites,
        deltas: s.deltas,
        voted: s.voted,
        favs: s.favs,
        extras: s.extras,
        settings: s.settings,
        savedSettings: s.savedSettings,
      }),
    },
  ),
);

export function useHydrateApp() {
  const ready = useApp((s) => s.ready);
  useEffect(() => {
    if (useApp.persist.hasHydrated()) {
      useApp.setState({ ready: true });
      return;
    }
    const pending = useApp.persist.rehydrate();
    void Promise.resolve(pending).then(() => useApp.setState({ ready: true }));
  }, []);
  return ready;
}

export function usePublished() {
  const extras = useApp((s) => s.extras);
  return useMemo(() => [...prompts, ...extras.filter((e) => e.status === "published")], [extras]);
}
