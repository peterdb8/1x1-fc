const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Liverpool goalkeepers with highest ratings
const players = [
  { name: 'Alisson', id: '22', rating: 89, url: 'https://www.wefut.com/player/26/22/alisson' },
  { name: 'Giorgi Mamardashvili', id: '198', rating: 84, url: 'https://www.wefut.com/player/26/198/giorgi-mamardashvili' },
  { name: 'Rafaela Borggräfe', id: '493', rating: 81, url: 'https://www.wefut.com/player/26/493/rafaela-borggrafe' },
  { name: 'Rachael Laws', id: '3324', rating: 73, url: 'https://www.wefut.com/player/26/3324/rachael-laws' },
  { name: 'Freddie Woodman', id: '4719', rating: 71, url: 'https://www.wefut.com/player/26/4719/freddie-woodman' },
  { name: 'Ármin Pécsi', id: '11548', rating: 64, url: 'https://www.wefut.com/player/26/11548/armin-pecsi' },
  { name: 'Harvey Davies', id: '22827', rating: 61, url: 'https://www.wefut.com/player/26/22827/harvey-davies' },
  { name: 'Faye Kirby', id: '15111', rating: 60, url: 'https://www.wefut.com/player/26/15111/faye-kirby' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const projectDir = path.join(__dirname, 'Developer', '1x1-fc');
  const liverpoolDir = path.join(projectDir, 'Liverpool');
  if (!fs.existsSync(liverpoolDir)) {
    fs.mkdirSync(liverpoolDir, { recursive: true });
  }

  console.log(`Starting to capture ${players.length} Liverpool goalkeeper cards...`);
  console.log(`Saving to: ${liverpoolDir}`);

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

              const filename = `${player.name.replace(/\s+/g, '_').replace(/'/g, '').replace(/ä/g, 'a').replace(/é/g, 'e')}_${player.rating}.png`;
              await cardElement.screenshot({
                path: path.join(liverpoolDir, filename),
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
        const filename = `${player.name.replace(/\s+/g, '_').replace(/'/g, '').replace(/ä/g, 'a').replace(/é/g, 'e')}_${player.rating}.png`;
        await page.screenshot({
          path: path.join(liverpoolDir, filename),
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
  console.log(`\nComplete! Liverpool goalkeeper cards saved to: ${liverpoolDir}`);
})();
