"use client";
import { useState } from "react";
const post = (u, b) => fetch(u, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
export default function Admin() {
  const [pw, setPw] = useState(""), [rows, setRows] = useState(null), [total, setTotal] = useState(0);
  const [text, setText] = useState(""), [one, setOne] = useState(""), [info, setInfo] = useState(""), [cap, setCap] = useState(""), [bids, setBids] = useState([]);
  async function load() {
    const [a, b] = await Promise.all([fetch("/api/admin/biz"), fetch("/api/admin/bids")]);
    if (a.ok) { setRows((await a.json()).rows); if (b.ok) { const bd = await b.json(); setTotal(bd.totalRupees); setBids(bd.rows); } } else setInfo("Login chahiye");
  }
  async function login(e) { e.preventDefault(); const r = await post("/api/admin/login", { password: pw }); if (r.ok) load(); else setInfo("Galat password"); }
  async function send(action, t) {
    const r = await post("/api/admin/biz", { action, text: t }); const d = await r.json();
    setInfo(r.ok ? `Joda: ${d.added}, chhoda (duplicate/galat): ${d.skipped}` : d.error); setText(""); setOne(""); load();
  }
  async function appr(id, action) { if (action === "reject" && !confirm("Reject karna hai?")) return; await post("/api/admin/bids", { id, action }); load(); }
  async function makePost() { const r = await fetch("/api/admin/post"); const d = await r.json(); setCap(r.ok ? d.caption : d.error); }
  async function edit(r) {
    const about = prompt("About (kya karta hai)", r.about || ""); if (about === null) return;
    const address = prompt("Dukaan ka pata", r.address || ""); if (address === null) return;
    const services = prompt("Best services", r.services || ""); if (services === null) return;
    const instagram = prompt("Instagram @handle", r.instagram || ""); if (instagram === null) return;
    await post("/api/admin/biz", { action: "details", id: r.id, about, address, services, instagram }); load();
  }
  async function act(id, action, value) { await post("/api/admin/biz", { id, action, value }); load(); }
  if (!rows) return (
    <main className="wrap"><h1>Admin</h1>
      <form className="bid" onSubmit={login}>
        <label htmlFor="p">Password</label>
        <input id="p" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        <button className="pay">Login</button>{info && <p className="msg err">{info}</p>}
      </form></main>);
  return (
    <main className="wrap adm"><h1>Admin</h1>
      <p><b>Total kamai: ₹{total}</b></p>
      <div className="bid"><h2>Ek business jodo</h2>
        <p className="hint">Format: naam, category, shahar, mobile</p>
        <input value={one} onChange={(e) => setOne(e.target.value)} placeholder="Sri Offset, printing, Madurai, 9876543210" />
        <button className="pay" onClick={() => send("add", one)}>Jodo</button></div>
      <div className="bid" style={{ marginTop: 14 }}><h2>Bahut saare ek saath</h2>
        <p className="hint">Har line mein ek business, upar wale format mein. Ek baar mein 200 tak.</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button className="pay" onClick={() => send("import", text)}>Import karo</button></div>
      {info && <p className="msg">{info}</p>}
      <div className="bid" style={{ marginTop: 14 }}><h2>UPI payments check karo ({bids.filter((x) => x.status === "submitted").length})</h2>
        <p className="hint">Apne UPI app mein paisa aur UTR match karke hi Approve dabao.</p>
        {bids.filter((x) => x.status === "submitted").map((x) => (
          <p key={x.id}><b>{x.title}</b> · ₹{x.amount_paise / 100}<br />UTR: {x.payment_id}<br />
            <button onClick={() => appr(x.id, "approve")}>Approve</button><button onClick={() => appr(x.id, "reject")}>Reject</button></p>))}</div>
      <div className="bid" style={{ marginTop: 14 }}><h2>Aaj ka Instagram post</h2>
        <p className="hint">Aaj ke #1 ka caption. Copy karke Instagram par khud post karo.</p>
        <button className="pay" onClick={makePost}>Caption banao</button>
        {cap && <textarea readOnly value={cap} onFocus={(e) => e.target.select()} />}</div>
      <h2>Businesses ({rows.length})</h2>
      <table><tbody>{rows.map((r) => (
        <tr key={r.id}><td><b>{r.name}</b><br />{r.category} · {r.city}<br />{r.phone || "no number"} {r.claimed ? "✅ khud juda" : ""}</td>
          <td><button onClick={() => edit(r)}>Details</button><button onClick={() => act(r.id, "public", !r.phone_public)}>{r.phone_public ? "Number public ✓" : "Number chhupa"}</button>
            <button onClick={() => act(r.id, r.hidden ? "show" : "hide")}>{r.hidden ? "Dikhao" : "Chhupao"}</button></td></tr>))}
      </tbody></table></main>);
}
