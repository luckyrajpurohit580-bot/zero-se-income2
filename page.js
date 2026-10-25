const mail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "aapka@email.com";
const P = {
  terms: ["Niyam aur Shartein", [
    "ZERO SE INCOME ek paid leaderboard hai. Board par jagah bid ki rakam se tay hoti hai; sabse zyada total bid wala upar.",
    "Ye sirf paid visibility hai. Traffic, customers ya kamai ki koi guarantee nahi di jaati.",
    "Aap sirf apna ya apne adhikar wala link daal sakte ho. Adult, dhokha, nakli kamai ke daave, hacking, jua/satta, hate ya kanoon ke khilaaf links allowed nahi hain.",
    "Hum kisi bhi link ko bina bataye chhupa ya hata sakte hain. Niyam todne par bid wapas nahi hogi.",
    "Aaj ka board har raat 12 baje (IST) naya shuru hota hai. Ab tak ka board sabhi paid bids ka total dikhata hai.",
    "Aaj ke #1 business ko website par Spotlight milta hai aur operator uska Instagram post bana sakta hai. Post ke samay, reach ya customers ki guarantee nahi. Spotlight ki details (kaam, pata, services) business ki khud ki di hui hoti hain, hum unki jaanch nahi karte.",
    "Businesses ko pehle se listed dikhaya ja sakta hai (naam/shahar). Malik ki sahmati ke bina unka number public nahi hota. Koi bhi apni listing hatwa sakta hai.",
    "UPI se payment mein bid tabhi board par dikhti hai jab hum payment confirm kar lein (kuch ghante lag sakte hain). Galat ya nakli UTR par bid reject hogi.",
    "Kam se kam bid ₹10 aur zyada se zyada ₹50,000 hai (poore rupaye).",
    "Board par links 'sponsored' hain; hum unki sachchai ki zimmedari nahi lete. Click karne se pehle khud jaanch lo."]],
  privacy: ["Privacy Policy", [
    "Hum sirf wo jaankari rakhte hain jo aap bid karte waqt dete ho: link/handle, board ka naam, bid ki rakam.",
    "Payment Razorpay par hota hai. Aapke card, UPI ya bank ki details hum nahi dekhte aur na rakhte hain. Hum sirf order aur payment ID rakhte hain.",
    "Link aur naam board par sabko dikhte hain. Jo cheez public nahi karni, wo mat daalo.",
    "Business ka naam, category aur shahar ki public listing banti hai. Mobile number tabhi dikhta hai jab malik ne sahmati di ho. Listing ya number hatane ke liye Contact par likho, hum 48 ghante mein hata denge.",
    "Hum aapki jaankari bechte nahi. Hata dene ke liye Contact par likho."]],
  refund: ["Refund Policy", [
    "Bid ka payment safal hone ke baad refund nahi hota, kyunki board par jagah turant mil jaati hai.",
    "Agar paise kat gaye lekin board par bid nahi dikhi, 7 din ke andar Contact par payment ID ke saath likho. Jaanch ke baad rakam 5-7 kaam ke dino mein wapas ya bid jod di jaayegi.",
    "Double payment hone par extra rakam wapas ki jaayegi.",
    "Niyam todne wale link hatane par refund nahi milta."]],
  contact: ["Contact", [
    "Kisi bhi samasya ke liye email karo: " + mail,
    "Payment ID ya link saath likho taaki jaldi madad ho sake.",
    "Jawab 2-3 kaam ke dino mein diya jaata hai."]],
};
export function generateStaticParams() { return Object.keys(P).map((slug) => ({ slug })); }
export default function Legal({ params }) {
  const d = P[params.slug];
  if (!d) return <main className="wrap"><h1>Page nahi mila</h1></main>;
  return (
    <main className="wrap legal"><a href="/">← Wapas</a><h1>{d[0]}</h1>
      <ul>{d[1].map((t, i) => <li key={i}>{t}</li>)}</ul></main>);
}
