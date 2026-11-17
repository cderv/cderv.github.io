// Renders _social-card/card.html to images/social-card.png (1200 x 630).
const path = require("node:path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto("file://" + path.resolve(__dirname, "card.html"));
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.resolve(__dirname, "..", "images", "social-card.png") });
  await browser.close();
})();
