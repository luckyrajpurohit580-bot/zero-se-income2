import { NextResponse } from "next/server";
import { sql, init } from "../../../lib/db.js";
import { verifyWebhook } from "../../../lib/sig.js";
export const dynamic = "force-dynamic";
export async function POST(req) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("x-razorpay-signature"), process.env.RAZORPAY_WEBHOOK_SECRET))
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  try {
    const ev = JSON.parse(raw);
    const p = ev?.payload?.payment?.entity;
    if (ev.event === "payment.captured" && p?.order_id) {
      await init();
      await sql()`UPDATE bids SET status='paid', payment_id=${p.id}, paid_at=now() WHERE order_id=${p.order_id} AND amount_paise=${p.amount} AND status<>'paid'`;
    }
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "error" }, { status: 500 }); }
}
