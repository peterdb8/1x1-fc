const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Real Madrid players with highest ratings (one per player name)
const players = [
  { name: 'Kylian Mbappé', id: '21105', rating: 96, url: 'https://www.wefut.com/player/26/21105/kylian-mbappe' },
  { name: 'Arda Güler', id: '23059', rating: 93, url: 'https://www.wefut.com/player/26/23059/arda-guler' },
  { name: 'Jude Bellingham', id: '23492', rating: 93, url: 'https://www.wefut.com/player/26/23492/jude-bellingham' },
  { name: 'Aurélien Tchouaméni', id: '23642', rating: 92, url: 'https://www.wefut.com/player/26/23642/aurelien-tchouameni' },
  { name: 'Vini Jr.', id: '21661', rating: 92, url: 'https://www.wefut.com/player/26/21661/vini-jr' },
  { name: 'Dean Huijsen', id: '21593', rating: 91, url: 'https://www.wefut.com/player/26/21593/dean-huijsen' },
  { name: 'Antonio Rüdiger', id: '23321', rating: 91, url: 'https://www.wefut.com/player/26/23321/antonio-rudiger' },
  { name: 'Federico Valverde', id: '23156', rating: 91, url: 'https://www.wefut.com/player/26/23156/federico-valverde' },
  { name: 'Álvaro Carreras', id: '21253', rating: 90, url: 'https://www.wefut.com/player/26/21253/alvaro-carreras' },
  { name: 'Brahim', id: '23328', rating: 90, url: 'https://www.wefut.com/player/26/23328/brahim' },
  { name: 'Trent Alexander-Arnold', id: '23540', rating: 90, url: 'https://www.wefut.com/player/26/23540/trent-alexander-arnold' },
  // Goalkeepers
  { name: 'Thibaut Courtois', id: '20842', rating: 90, url: 'https://www.wefut.com/player/26/20842/thibaut-courtois' },
  { name: 'Andriy Lunin', id: '522', rating: 81, url: 'https://www.wefut.com/player/26/522/andriy-lunin' },
  { name: 'Fran González', id: '13160', rating: 63, url: 'https://www.wefut.com/player/26/13160/fran-gonzalez' },
  { name: 'Sergio Mestre', id: '20503', rating: 60, url: 'https://www.wefut.com/player/26/20503/sergio-mestre' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const projectDir = path.join(__dirname, 'Developer', '1x1-fc');
  const realMadridDir = path.join(projectDir, 'RealMadrid');
  if (!fs.existsSync(realMadridDir)) {
    fs.mkdirSync(realMadridDir, { recursive: true });
  }

  console.log(`Starting to capture ${players.length} Real Madrid player cards...`);
  console.log(`Saving to: ${realMadridDir}`);

  let cookieBannerHandled = false;

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    try {
      console.log(`[${i + 1}/${players.length}] Processing ${player.name} (Rating: ${player.rating}, ID: ${player.id})...`);

      await page.goto(player.url, { waitUntil: 'networkidle' });

      if (!cookieBannerHandled) {
        try {
          const cookieSelectors = [
            'button:has-text("Accept")',
            'button:has-text("Agree")',
            'button:has-text("OK")',
            'button:has-text("Got it")',
            '[class*="cookie"] button',
            '[id*="cookie"] button',
            '.fc-button.fc-cta-consent',
            '#onetrust-accept-btn-handler',
            '.cookie-accept',
            'button[class*="accept"]'
          ];

          for (const selector of cookieSelectors) {
            try {
              const button = await page.$(selector);
              if (button) {
                await button.click();
                console.log(`  ✓ Clicked cookie banner`);
                await page.waitForTimeout(1000);
                break;
              }
            } catch (e) {
              // Continue to next selector
            }
          }
          cookieBannerHandled = true;
        } catch (cookieError) {
          console.log(`  ℹ No cookie banner found or already handled`);
          cookieBannerHandled = true;
        }
      }

      await page.waitForTimeout(2000);

      const cardSelectors = [
        'img[src*="futhead"]',
        'img[src*="card"]',
        'img[alt*="card"]',
        '.card img',
        '#playerImage img',
        'img[src*="player"]'
      ];

      let captured = false;

      for (const cardSelector of cardSelectors) {
        try {
          const cardElement = await page.$(cardSelector);

          if (cardElement) {
            const isVisible = await cardElement.isVisible();
            if (isVisible) {
              await page.waitForTimeout(500);

              const filename = `${player.name.replace(/\s+/g, '_').replace(/'/g, '').replace(/ü/g, 'u').replace(/é/g, 'e').replace(/á/g, 'a')}_${player.rating}.png`;
              await cardElement.screenshot({
                path: path.join(realMadridDir, filename),
                type: 'png'
              });
              console.log(`  ✓ Saved: ${filename}`);
              captured = true;
              break;
            }
          }
        } catch (e) {
          // Try next selector
        }
      }

      if (!captured) {
        console.log(`  ⚠ Card image not found, trying broader approach...`);
        const filename = `${player.name.replace(/\s+/g, '_').replace(/'/g, '').replace(/ü/g, 'u').replace(/é/g, 'e').replace(/á/g, 'a')}_${player.rating}.png`;
        await page.screenshot({
          path: path.join(realMadridDir, filename),
          clip: { x: 150, y: 200, width: 300, height: 450 }
        });
        console.log(`  ✓ Saved region: ${filename}`);
      }

      await page.waitForTimeout(1000);

    } catch (error) {
      console.error(`  ✗ Error processing ${player.name} (${player.id}):`, error.message);
    }
  }

  await browser.close();
  console.log(`\nComplete! Real Madrid player cards saved to: ${realMadridDir}`);
  console.log(`Total cards captured: ${players.length}`);
})();
