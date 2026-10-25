import { hmac, safeEq } from "./sig.js";
export const COOKIE = "zsi_admin";
export function adminToken() { return hmac("admin", process.env.SESSION_SECRET || ""); }
export function isAdmin(req) {
  if (!process.env.SESSION_SECRET || !process.env.ADMIN_PASSWORD) return false;
  return safeEq(req.cookies.get(COOKIE)?.value, adminToken());
}
