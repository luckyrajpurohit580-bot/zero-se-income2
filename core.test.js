import test from "node:test";
import assert from "node:assert/strict";
import { buildBoard, normalizeLink, validRupees, normalizePhone, cleanHandle, cleanText } from "../lib/rank.js";
import { buildCaption } from "../lib/caption.js";
import { hmac, verifyPayment, verifyWebhook } from "../lib/sig.js";

test("highest total is rank 1, tie goes to earlier", () => {
  const b = buildBoard([
    { link: "https://a.com/", title: "A", amount_paise: 1000, paid_at: "2026-01-01T10:00:00Z" },
    { link: "https://b.com/", title: "B", amount_paise: 1000, paid_at: "2026-01-01T11:00:00Z" },
    { link: "https://b.com/", title: "B", amount_paise: 100, paid_at: "2026-01-01T12:00:00Z" },
  ]);
  assert.equal(b[0].link, "https://b.com/");
  assert.equal(b[0].rupees, 11);
  assert.equal(b[1].rank, 2);
});
test("same link bids add up (case-insensitive)", () => {
  const b = buildBoard([
    { link: "https://A.com/", title: "A", amount_paise: 1000, paid_at: "2026-01-01T10:00:00Z" },
    { link: "https://a.com/", title: "A", amount_paise: 2000, paid_at: "2026-01-01T11:00:00Z" },
  ]);
  assert.equal(b.length, 1);
  assert.equal(b[0].rupees, 30);
});
test("link validation blocks bad schemes", () => {
  assert.equal(normalizeLink("javascript:alert(1)"), null);
  assert.equal(normalizeLink("@my_handle"), "@my_handle");
  assert.equal(normalizeLink("example.com/x"), "https://example.com/x");
  assert.equal(normalizeLink("@bad handle"), null);
});
test("rupee limits", () => {
  assert.equal(validRupees(10), true);
  assert.equal(validRupees(9), false);
  assert.equal(validRupees(10.5), false);
  assert.equal(validRupees(50001), false);
});
test("payment signature", () => {
  const sig = hmac("order_1|pay_1", "secret");
  assert.equal(verifyPayment("order_1", "pay_1", sig, "secret"), true);
  assert.equal(verifyPayment("order_1", "pay_2", sig, "secret"), false);
  assert.equal(verifyPayment("order_1", "pay_1", "", "secret"), false);
});
test("webhook signature", () => {
  const body = '{"event":"payment.captured"}';
  assert.equal(verifyWebhook(body, hmac(body, "wh"), "wh"), true);
  assert.equal(verifyWebhook(body + " ", hmac(body, "wh"), "wh"), false);
});
test("phone normalize", () => {
  assert.equal(normalizePhone("98765 43210"), "9876543210");
  assert.equal(normalizePhone("+91 98765-43210"), "9876543210");
  assert.equal(normalizePhone("12345"), null);
  assert.equal(normalizePhone("5876543210"), null);
});
test("handle and text cleaning", () => {
  assert.equal(cleanHandle("@shop_1"), "@shop_1");
  assert.equal(cleanHandle("javascript:x"), null);
  assert.equal(cleanText("<b>Hi</b>   there", 50), "bHi/b there");
  assert.equal(cleanText("x".repeat(500), 300).length, 300);
});
test("instagram caption has name, services, address, link; skips missing fields", () => {
  const c = buildCaption({ name: "Sri Offset", category: "printing", city: "Madurai", services: "Cards, Flex", address: "Main Rd", instagram: "@sri" }, "https://s.in");
  for (const x of ["Sri Offset", "Cards, Flex", "Main Rd", "@sri", "https://s.in"]) assert.ok(c.includes(x));
  assert.ok(!c.includes("📞"));
});
