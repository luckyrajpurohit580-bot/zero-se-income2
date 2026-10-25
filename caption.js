export function buildCaption(b, site) {
  const L = ["🏆 आज का #1 | Today's #1 | இன்றைய #1", `${b.name} (${b.category}, ${b.city})`];
  if (b.about) L.push(b.about);
  if (b.services) L.push("✅ " + b.services);
  if (b.address) L.push("📍 " + b.address);
  if (b.phone) L.push("📞 " + b.phone);
  if (b.instagram) L.push("📸 " + b.instagram);
  L.push("Leaderboard: " + site, "#TamilNadu #Printing #ZeroSeIncome");
  return L.join("\n");
}
