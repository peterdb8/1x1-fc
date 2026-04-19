const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Additional Real Madrid players not yet captured (highest rating per unique player name)
const players = [
  // Already have these from previous script, but listing higher ratings if available
  { name: 'Kylian Mbappé', id: '23641', rating: 93, url: 'https://www.wefut.com/player/26/23641/kylian-mbappe' },
  { name: 'Rodrygo', id: '20863', rating: 89, url: 'https://www.wefut.com/player/26/20863/rodrygo' },
  { name: 'Carvajal', id: '20981', rating: 89, url: 'https://www.wefut.com/player/26/20981/carvajal' },
  { name: 'Gonzalo', id: '23791', rating: 89, url: 'https://www.wefut.com/player/26/23791/gonzalo' },
  { name: 'Franco Mastantuono', id: '21709', rating: 89, url: 'https://www.wefut.com/player/26/21709/franco-mastantuono' },
  { name: 'Éder Militão', id: '19790', rating: 88, url: 'https://www.wefut.com/player/26/19790/eder-militao' },
  { name: 'David Alaba', id: '20175', rating: 87, url: 'https://www.wefut.com/player/26/20175/david-alaba' },
  { name: 'Eduardo Camavinga', id: '20607', rating: 87, url: 'https://www.wefut.com/player/26/20607/eduardo-camavinga' },
  { name: 'Ferland Mendy', id: '21681', rating: 87, url: 'https://www.wefut.com/player/26/21681/ferland-mendy' },
  { name: 'Endrick', id: '20182', rating: 86, url: 'https://www.wefut.com/player/26/20182/endrick' },
  { name: 'Fran García', id: '851', rating: 79, url: 'https://www.wefut.com/player/26/851/fran-garcia' },
  { name: 'Asencio', id: '1540', rating: 77, url: 'https://www.wefut.com/player/26/1540/asencio' },
  { name: 'Dani Ceballos', id: '534', rating: 81, url: 'https://www.wefut.com/player/26/534/dani-ceballos' },
  { name: 'Thiago Pitarch', id: '20500', rating: 60, url: 'https://www.wefut.com/player/26/20500/thiago-pitarch' },
  { name: 'Fortea', id: '20493', rating: 60, url: 'https://www.wefut.com/player/26/20493/fortea' },
  { name: 'Diego Aguado', id: '20508', rating: 59, url: 'https://www.wefut.com/player/26/20508/diego-aguado' }
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

  console.log(`Starting to capture ${players.length} additional Real Madrid player cards...`);
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

              const filename = `${player.name.replace(/\s+/g, '_').replace(/'/g, '').replace(/ü/g, 'u').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ñ/g, 'n')}_${player.rating}.png`;
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
        const filename = `${player.name.replace(/\s+/g, '_').replace(/'/g, '').replace(/ü/g, 'u').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ñ/g, 'n')}_${player.rating}.png`;
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
  console.log(`\nComplete! Additional Real Madrid player cards saved to: ${realMadridDir}`);
  console.log(`Total cards captured: ${players.length}`);
})();
