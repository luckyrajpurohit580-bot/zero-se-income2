import crypto from "node:crypto";
export function safeEq(a, b) {
  const x = Buffer.from(String(a || "")), y = Buffer.from(String(b || ""));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
export function hmac(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}
export function verifyPayment(orderId, paymentId, signature, secret) {
  return safeEq(hmac(orderId + "|" + paymentId, secret), signature);
}
export function verifyWebhook(rawBody, signature, secret) {
  return safeEq(hmac(rawBody, secret), signature);
}
