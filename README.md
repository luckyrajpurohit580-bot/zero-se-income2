# ZERO SE INCOME – Pay-to-Rank Leaderboard (Hindi)

Next.js + Neon (Postgres) + Razorpay. Login nahi chahiye. Admin sirf password se.

## Phone se live karne ke steps
1. **GitHub** (github.com): naya repo banao, is zip ki saari files upload karo (zip pehle extract karo).
2. **Neon** (neon.tech): project banao, "Connection string" copy karo. Table pehli request par apne aap ban jaati hai.
3. **Razorpay** (razorpay.com): Test mode mein Settings > API Keys > Generate. Key ID aur Secret copy karo.
4. **Vercel** (vercel.com): GitHub se login > Add New Project > apna repo > Environment Variables mein `.env.example` ki saari 7 cheezein bharo > Deploy.
5. **Webhook**: Razorpay > Settings > Webhooks > Add. URL: `https://APNI-SITE.vercel.app/api/webhook`, Event: `payment.captured`, Secret wahi jo `RAZORPAY_WEBHOOK_SECRET` mein dala.
6. Razorpay Settings mein payment capture "Automatic" rakho.

## Test (live jaane se pehle zaroori)
- Test mode mein ₹10 ki bid lagao (Razorpay test UPI/card), board par naam aana chahiye.
- `/admin` kholo, password se login, bid dikhni chahiye. "Chhupao" dabao, board se hat jaani chahiye.
- Webhook ke liye Razorpay dashboard mein "Test webhook" bhejo, 200 aana chahiye.
- Laptop par: `npm install && npm test`.

## Live jaana
KYC approve hone par Razorpay ke **Live keys** Vercel env mein badlo, Redeploy karo, ek chhoti asli bid karke check karo.

## Admin
`/admin` par `ADMIN_PASSWORD` se login. Yahan har bid, total kamai, chhupana/dikhana aur adhoori (unpaid) bid delete karna hai.

## Dhyan rakhne wali baatein
- Policies (`app/legal/[slug]/page.js`) mein apna naam/email jodo. Razorpay KYC mein ye pages dekhta hai.
- Site par "guaranteed kamai" jaisa kuch mat likho.
- Rate limiting nahi hai. Spam ho to Vercel Firewall ya Cloudflare lagao.
- Admin mein paid bid delete nahi hoti (record bachta hai), sirf chhupti hai.
- Is code ka unit test hua hai (ranking, link check, payment/webhook signature). Poora `next build` aur asli Razorpay payment aap ke test mode mein check karna hoga.

## v2: Tamil Nadu printing leaderboard
- Teen bhasha: English, Tamil, Hindi (upar button se badlo).
- `/admin`: ek ya bahut saare businesses jodo (format: `naam, category, shahar, mobile`). Category: printing, designing, flex, wholesale, other.
- Admin se jode gaye businesses ka **number chhupa rehta hai**. Malik se WhatsApp par haan lekar "Number chhupa" dabao, tab public hoga.
- Business khud bhi "Register" se judta hai; checkbox tick kare to number turant public.
- Bid business ke naam par lagti hai. Board par rank sirf paid bid se milta hai; bina bid wale "NEW" dikhte hain.
- Pehle se pehli baar chalane par naye tables apne aap ban jaate hain.
- Outreach: har business ko apne number se alag-alag message bhejo, "reply STOP to opt out" likho, ek din mein limit rakho. Bulk spam se WhatsApp/Instagram ban ho jata hai.
- Visiting card abhi sirf image ka link se lagta hai (upload baad mein).

## v3: Spotlight
- Aaj ka #1 business website ke upar bade card mein dikhta hai: kaam, services, pata, Instagram, call.
- Ye details business register karte waqt khud bharta hai. Admin mein "Details" dabakar aap bhi bhar sakte ho (owner se pooch kar).
- `/admin` > "Caption banao" aaj ke #1 ka Instagram caption deta hai. Copy karke khud post karo (auto-post ke liye Meta ka business approval chahiye, wo baad mein).
- `.env` mein `SITE_URL` apni site ka link daalo, caption mein wahi jayega.

## v4: Apna UPI ID / QR se payment (KYC ke bina)
1. Vercel env mein `UPI_ID` (jaise `9876543210@ybl`), `UPI_NAME` aur `RAZORPAY_KEY_ID` **khali ya delete** rakho. Tab website UPI mode mein chalti hai.
2. Apna QR ki photo `public/upi-qr.png` naam se GitHub repo mein upload karo, aur `NEXT_PUBLIC_UPI_QR=/upi-qr.png` set karo.
3. Business "Bid" dabata hai, UPI se pay karta hai, 12 ank ka UTR daalta hai.
4. `/admin` > "UPI payments check karo": apne UPI app mein paisa aur UTR match karo, phir **Approve**. Tab bid board par aati hai.
5. Nakli screenshot se bacho: sirf apne bank/UPI app mein aaya credit dekh kar approve karo. Ek UTR doosri baar use nahi ho sakta.
6. Jab KYC ho jaye, `RAZORPAY_KEY_ID` aur baaki keys daal do, website apne aap Razorpay mode mein chali jayegi.
