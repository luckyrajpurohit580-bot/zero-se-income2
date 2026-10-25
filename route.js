import { NextResponse } from "next/server";
import { sql, init } from "../../../lib/db.js";
import { verifyPayment } from "../../../lib/sig.js";
export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    const { order_id, payment_id, signature } = await req.json();
    if (!verifyPayment(order_id, payment_id, signature, process.env.RAZORPAY_KEY_SECRET))
      return NextResponse.json({ error: "Payment verify nahi hua" }, { status: 400 });
    await init();
    await sql()`UPDATE bids SET status='paid', payment_id=${payment_id}, paid_at=now() WHERE order_id=${order_id} AND status<>'paid'`;
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Verify error" }, { status: 500 }); }
}
