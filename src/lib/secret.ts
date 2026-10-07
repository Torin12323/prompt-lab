const PREFIX = "pbkdf2";

export async function sealPassword(password: string, salt?: string) {
  const useSalt =
    salt ??
    [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: new TextEncoder().encode(useSalt), iterations: 120_000 },
    key,
    256,
  );
  const hex = [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${PREFIX}$${useSalt}$${hex}`;
}

export async function passwordMatches(stored: string, password: string) {
  if (!stored.startsWith(`${PREFIX}$`)) return stored === password;
  const salt = stored.split("$")[1];
  if (!salt) return false;
  return (await sealPassword(password, salt)) === stored;
}
