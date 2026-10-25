"use client";
import { useState, useEffect } from "react";
import { T, LANGS } from "../lib/i18n.js";

function loadRzp() {
  return new Promise((res, rej) => {
    if (window.Razorpay) return res();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = res; s.onerror = () => rej(new Error("Payment window load nahi hui"));
    document.body.appendChild(s);
  });
}
const post = (u, b) => fetch(u, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
const safe = (l) => (/^https:\/\//.test(l || "") ? l : null);

export default function Wall({ initial, dbError }) {
  const [lang, setLang] = useState("hi");
  const [tab, setTab] = useState("today");
  const [boards, setBoards] = useState(initial);
  const [sel, setSel] = useState(null);
  const [manual, setManual] = useState(null);
  const [utr, setUtr] = useState("");
  const [amt, setAmt] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(dbError ? { t: "err", m: "Database abhi connect nahi hai." } : null);
  const [reg, setReg] = useState({ name: "", category: "printing", city: "", phone: "", cardUrl: "", about: "", address: "", services: "", instagram: "", consent: false });
  const t = T[lang];
  const board = boards[tab];
  const top = board[0] && board[0].rank ? board[0] : null;

  useEffect(() => { try { const l = localStorage.getItem("lang"); if (T[l]) setLang(l); } catch {} }, []);
  useEffect(() => { const i = setInterval(refresh, 30000); return () => clearInterval(i); }, []);
  function pick(l) { setLang(l); try { localStorage.setItem("lang", l); } catch {} }
  async function refresh() {
    try {
      const [a, b] = await Promise.all([fetch("/api/board?tab=today"), fetch("/api/board?tab=all")]);
      if (a.ok && b.ok) setBoards({ today: (await a.json()).board, all: (await b.json()).board });
    } catch {}
  }

  async function register(e) {
    e.preventDefault(); setMsg(null); setBusy(true);
    try {
      const r = await post("/api/register", reg); const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error");
      setSel({ id: d.id, name: d.name }); setMsg({ t: "ok", m: t.regok });
      setReg({ name: "", category: "printing", city: "", phone: "", cardUrl: "", about: "", address: "", services: "", instagram: "", consent: false }); refresh();
    } catch (err) { setMsg({ t: "err", m: err.message }); }
    setBusy(false);
  }

  async function sendUtr() {
    const r = await post("/api/utr", { order_id: manual.orderId, utr }); const d = await r.json();
    if (!r.ok) return setMsg({ t: "err", m: d.error });
    setMsg({ t: "ok", m: t.utrOk }); setManual(null); setUtr(""); setAmt("");
  }

  async function pay(e) {
    e.preventDefault(); if (!sel) return setMsg({ t: "err", m: t.pick });
    setMsg(null); setBusy(true);
    try {
      const r = await post("/api/order", { businessId: sel.id, rupees: Number(amt) }); const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error");
      if (d.manual) { setManual(d); setBusy(false); return; }
      await loadRzp();
      new window.Razorpay({
        key: d.keyId, order_id: d.orderId, amount: d.amount, currency: "INR",
        name: "ZERO SE INCOME", description: sel.name, theme: { color: "#e63946" },
        handler: async (x) => {
          const v = await post("/api/verify", { order_id: x.razorpay_order_id, payment_id: x.razorpay_payment_id, signature: x.razorpay_signature });
          setBusy(false);
          if (v.ok) { setMsg({ t: "ok", m: t.done }); setAmt(""); refresh(); }
          else setMsg({ t: "err", m: "Payment verify nahi hua. Paise kat gaye hon to Contact par likho." });
        },
        modal: { ondismiss: () => setBusy(false) },
      }).open();
    } catch (err) { setMsg({ t: "err", m: err.message }); setBusy(false); }
  }

  return (
    <main className="wrap">
      <div className="langs">{LANGS.map(([k, n]) => <button key={k} className="tab" aria-pressed={lang === k} onClick={() => pick(k)}>{n}</button>)}</div>
      <div className="brand">ZERO SE INCOME</div>
      <h1>{t.h1}</h1>
      <p className="lead">{t.lead}</p>

      <section className="throne" aria-label={t.top}>
        <small>{tab === "today" ? t.top : t.topAll}</small>
        {top ? (<><div className="amt">₹{top.rupees}</div><div className="nm">{top.name}</div><small>{t.cats[top.category]} · {top.city}</small>
          <p className="sp"><b>{t.spot}</b></p>
          {top.about && <p className="sp">{top.about}</p>}
          {top.services && <p className="sp">✅ {top.services}</p>}
          {top.address && <p className="sp">📍 {top.address}</p>}
          <p className="sp">{top.phone && <a href={"tel:+91" + top.phone}>📞 {t.call} {top.phone}</a>} {top.instagram && <a href={"https://instagram.com/" + top.instagram.slice(1)} target="_blank" rel="nofollow noopener noreferrer">📸 {top.instagram}</a>}</p>
          {(top.about || top.services || top.address) && <small>{t.selfNote}</small>}</>)
          : (<><div className="amt">—</div><div className="nm">{t.none}</div></>)}
      </section>

      <div className="tabs">
        <button className="tab" aria-pressed={tab === "today"} onClick={() => setTab("today")}>{t.today}</button>
        <button className="tab" aria-pressed={tab === "all"} onClick={() => setTab("all")}>{t.all}</button>
      </div>

      <ol className="board">
        {board.map((b) => (
          <li className="row" key={b.id}>
            <span className="rk">{b.rank ? "#" + b.rank : t.new}</span>
            <span className="who">
              <b>{b.name}</b>
              <span>{t.cats[b.category] || b.category} · {b.city}</span>
              <span>
                {b.phone ? <a href={"tel:+91" + b.phone}>📞 {t.call} {b.phone}</a> : <i>🔒 {t.locked}</i>}
                {safe(b.cardUrl) && <> · <a href={safe(b.cardUrl)} target="_blank" rel="nofollow noopener noreferrer">{t.cardL}</a></>}
              </span>
            </span>
            <span className="rs">{b.rupees > 0 ? "₹" + b.rupees : ""}<br /><button className="quick" onClick={() => { setSel({ id: b.id, name: b.name }); document.getElementById("bidform")?.scrollIntoView({ behavior: "smooth" }); }}>{t.bidBtn}</button></span>
          </li>
        ))}
      </ol>

      <form className="bid" id="bidform" onSubmit={pay}>
        <h2>{t.bidBtn}</h2>
        <p className="hint">{sel ? <>{t.sel}: <b>{sel.name}</b></> : t.pick}</p>
        <label htmlFor="r">{t.amt}</label>
        <input id="r" type="number" min="10" max="50000" step="1" inputMode="numeric" value={amt} onChange={(e) => setAmt(e.target.value)} required />
        <button className="pay" disabled={busy}>{busy ? "..." : t.pay}</button>
      </form>

      {manual && (
        <div className="bid" style={{ marginTop: 16 }}>
          <h2>₹{manual.rupees}</h2>
          <p>{t.upiTo}: <b>{manual.upiId}</b></p>
          {manual.qr && <img src={manual.qr} alt="UPI QR" width="220" style={{ maxWidth: "100%", height: "auto" }} />}
          <a className="pay" style={{ display: "block", textAlign: "center", textDecoration: "none" }} href={`upi://pay?pa=${encodeURIComponent(manual.upiId)}&pn=${encodeURIComponent(manual.upiName)}&am=${manual.rupees}&cu=INR&tn=${manual.ref}`}>{t.openUpi}</a>
          <p className="hint">Remark / Note: <b>{manual.ref}</b></p>
          <label htmlFor="u">{t.utr}</label>
          <input id="u" inputMode="numeric" maxLength={12} value={utr} onChange={(e) => setUtr(e.target.value.replace(/\D/g, ""))} />
          <button className="pay" type="button" onClick={sendUtr}>{t.sendUtr}</button>
        </div>
      )}

      <form className="bid" onSubmit={register} style={{ marginTop: 16 }}>
        <h2>{t.reg}</h2>
        <label htmlFor="n">{t.name}</label><input id="n" value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} maxLength={60} required />
        <label htmlFor="c">{t.cat}</label>
        <select id="c" value={reg.category} onChange={(e) => setReg({ ...reg, category: e.target.value })}>{Object.keys(t.cats).map((k) => <option key={k} value={k}>{t.cats[k]}</option>)}</select>
        <label htmlFor="ci">{t.city}</label><input id="ci" value={reg.city} onChange={(e) => setReg({ ...reg, city: e.target.value })} required />
        <label htmlFor="p">{t.phone}</label><input id="p" inputMode="tel" value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} required />
        <label htmlFor="cu">{t.card}</label><input id="cu" inputMode="url" value={reg.cardUrl} onChange={(e) => setReg({ ...reg, cardUrl: e.target.value })} />
        <label htmlFor="ab">{t.about}</label><input id="ab" maxLength={300} value={reg.about} onChange={(e) => setReg({ ...reg, about: e.target.value })} />
        <label htmlFor="ad">{t.address}</label><input id="ad" maxLength={150} value={reg.address} onChange={(e) => setReg({ ...reg, address: e.target.value })} />
        <label htmlFor="sv">{t.services}</label><input id="sv" maxLength={200} value={reg.services} onChange={(e) => setReg({ ...reg, services: e.target.value })} />
        <label htmlFor="ig">{t.ig}</label><input id="ig" autoCapitalize="none" value={reg.instagram} onChange={(e) => setReg({ ...reg, instagram: e.target.value })} />
        <label className="chk"><input type="checkbox" checked={reg.consent} onChange={(e) => setReg({ ...reg, consent: e.target.checked })} /> {t.consent}</label>
        <button className="pay" disabled={busy}>{t.send}</button>
      </form>
      {msg && <p className={"msg " + msg.t} role="status">{msg.m}</p>}
      <p className="hint">{t.disc}</p>
    </main>
  );
}
