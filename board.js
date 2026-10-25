import { sql, init } from "./db.js";
export async function getBoard(tab) {
  await init();
  const all = tab === "all";
  const rows = await sql()`
    SELECT b.id, b.name, b.category, b.city, b.card_url, b.about, b.address, b.services, b.instagram,
      CASE WHEN b.phone_public THEN b.phone END AS phone,
      COALESCE(SUM(x.amount_paise),0)::int AS paise
    FROM businesses b
    LEFT JOIN bids x ON x.business_id=b.id AND x.status='paid' AND x.hidden=false
      AND (${all} OR (x.paid_at AT TIME ZONE 'Asia/Kolkata')::date=(now() AT TIME ZONE 'Asia/Kolkata')::date)
    WHERE b.hidden=false
    GROUP BY b.id
    ORDER BY paise DESC, MIN(x.paid_at) ASC NULLS LAST, b.id DESC
    LIMIT 100`;
  let r = 0;
  return rows.map((x) => ({ id: x.id, name: x.name, category: x.category, city: x.city, phone: x.phone, cardUrl: x.card_url, about: x.about, address: x.address, services: x.services, instagram: x.instagram, rupees: x.paise / 100, rank: x.paise > 0 ? ++r : null }));
}
