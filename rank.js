export const MIN_RUPEES = 10;
export const MAX_RUPEES = 50000;

export function normalizeLink(input) {
  const s = String(input || "").trim();
  if (s.length < 3 || s.length > 200) return null;
  if (s.startsWith("@")) return /^@[A-Za-z0-9_.]{1,30}$/.test(s) ? s : null;
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : "https://" + s);
    if (!["http:", "https:"].includes(u.protocol) || !u.hostname.includes(".")) return null;
    return u.href;
  } catch { return null; }
}

export function cleanTitle(t) {
  return String(t || "").replace(/[<>]/g, "").trim().slice(0, 60);
}

export function validRupees(n) {
  return Number.isInteger(n) && n >= MIN_RUPEES && n <= MAX_RUPEES;
}

// rows: [{link,title,amount_paise,paid_at}] oldest first
export function buildBoard(rows) {
  const map = new Map();
  for (const r of rows) {
    const k = r.link.toLowerCase();
    const t = new Date(r.paid_at).getTime();
    const e = map.get(k) || { link: r.link, title: r.title, paise: 0, first: t };
    e.paise += r.amount_paise;
    e.title = r.title;
    map.set(k, e);
  }
  return [...map.values()]
    .sort((a, b) => b.paise - a.paise || a.first - b.first)
    .map((e, i) => ({ rank: i + 1, link: e.link, title: e.title, rupees: e.paise / 100 }));
}

export const CATS = ["printing", "designing", "flex", "wholesale", "other"];
export function normalizePhone(p) {
  const d = String(p || "").replace(/[\s\-+()]/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export function cleanText(t, max) { return String(t || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max); }
export function cleanHandle(h) { const s = String(h || "").trim(); return /^@[A-Za-z0-9_.]{1,30}$/.test(s) ? s : null; }
