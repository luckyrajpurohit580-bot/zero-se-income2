import "./globals.css";
export const metadata = {
  title: "ZERO SE INCOME – Aaj ka #1 kaun?",
  description: "Apna link ya @handle daalo, bid lagao aur leaderboard par #1 bano. Sabse zyada bid wala sabse upar.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body>
        {children}
        <footer className="foot">
          <a href="/legal/terms">Niyam</a><a href="/legal/privacy">Privacy</a>
          <a href="/legal/refund">Refund</a><a href="/legal/contact">Contact</a>
          <p>Ye paid placement hai. Rank bid se tay hota hai, kamai ya traffic ki koi guarantee nahi.</p>
        </footer>
      </body>
    </html>
  );
}
