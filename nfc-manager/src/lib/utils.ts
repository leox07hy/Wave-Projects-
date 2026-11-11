export function createPermanentSlug() {
  // 16 caracteres aleatórios gerados no navegador. O slug é criado uma única vez.
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0")).join("").slice(0, 16);
}

export function publicUrl(type: "pix" | "wifi", slug: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}/${type === "pix" ? "p" : "w"}/${slug}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}
