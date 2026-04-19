const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Liverpool players with highest ratings extracted from HTML
// Only including one entry per player - the highest rated version
const players = [
  { name: 'Virgil van Dijk', id: '21112', rating: 95, url: 'https://www.wefut.com/player/26/21112/virgil-van-dijk' },
  { name: 'Mohamed Salah', id: '23640', rating: 93, url: 'https://www.wefut.com/player/26/23640/mohamed-salah' },
  { name: 'Florian Wirtz', id: '23058', rating: 92, url: 'https://www.wefut.com/player/26/23058/florian-wirtz' },
  { name: 'Ryan Gravenberch', id: '23496', rating: 92, url: 'https://www.wefut.com/player/26/23496/ryan-gravenberch' },
  { name: 'Alexis Mac Allister', id: '23647', rating: 91, url: 'https://www.wefut.com/player/26/23647/alexis-mac-allister' },
  { name: "Denise O'Sullivan", id: '23067', rating: 91, url: "https://www.wefut.com/player/26/23067/denise-o-sullivan" },
  { name: 'Rio Ngumoha', id: '23370', rating: 90, url: 'https://www.wefut.com/player/26/23370/rio-ngumoha' },
  { name: 'Jeremie Frimpong', id: '21137', rating: 90, url: 'https://www.wefut.com/player/26/21137/jeremie-frimpong' },
  { name: 'Dominik Szoboszlai', id: '23336', rating: 90, url: 'https://www.wefut.com/player/26/23336/dominik-szoboszlai' },
  { name: 'Hugo Ekitiké', id: '23171', rating: 90, url: 'https://www.wefut.com/player/26/23171/hugo-ekitike' },
  { name: 'Ibrahima Konaté', id: '23790', rating: 89, url: 'https://www.wefut.com/player/26/23790/ibrahima-konate' },
  { name: 'Cody Gakpo', id: '19792', rating: 89, url: 'https://www.wefut.com/player/26/19792/cody-gakpo' },
  { name: 'Alexander Isak', id: '20802', rating: 89, url: 'https://www.wefut.com/player/26/20802/alexander-isak' },
  { name: 'Milos Kerkez', id: '23113', rating: 89, url: 'https://www.wefut.com/player/26/23113/milos-kerkez' },
  { name: 'Conor Bradley', id: '23538', rating: 88, url: 'https://www.wefut.com/player/26/23538/conor-bradley' },
  { name: 'Joe Gomez', id: '20817', rating: 87, url: 'https://www.wefut.com/player/26/20817/joe-gomez' },
  { name: 'Federico Chiesa', id: '19990', rating: 86, url: 'https://www.wefut.com/player/26/19990/federico-chiesa' },
  { name: 'Andrew Robertson', id: '19918', rating: 86, url: 'https://www.wefut.com/player/26/19918/andrew-robertson' },
  { name: 'Wataru Endo', id: '18298', rating: 84, url: 'https://www.wefut.com/player/26/18298/wataru-endo' },
  { name: 'Curtis Jones', id: '601', rating: 80, url: 'https://www.wefut.com/player/26/601/curtis-jones' },
  { name: 'Risa Shimizu', id: '18362', rating: 79, url: 'https://www.wefut.com/player/26/18362/risa-shimizu' },
  { name: 'Harvey Elliott', id: '1222', rating: 78, url: 'https://www.wefut.com/player/26/1222/harvey-elliott' },
  { name: 'Martha Thomas', id: '21750', rating: 77, url: 'https://www.wefut.com/player/26/21750/martha-thomas' },
  { name: 'Kostas Tsimikas', id: '1337', rating: 77, url: 'https://www.wefut.com/player/26/1337/kostas-tsimikas' },
  { name: 'Sophie Román Haug', id: '1838', rating: 76, url: 'https://www.wefut.com/player/26/1838/sophie-roman-haug' },
  { name: 'Ceri Holland', id: '1610', rating: 76, url: 'https://www.wefut.com/player/26/1610/ceri-holland' },
  { name: 'Alejandra Bernabé', id: '18460', rating: 75, url: 'https://www.wefut.com/player/26/18460/alejandra-bernabe' },
  { name: 'Gemma Bonner', id: '2382', rating: 75, url: 'https://www.wefut.com/player/26/2382/gemma-bonner' },
  { name: 'Grace Fisk', id: '2366', rating: 75, url: 'https://www.wefut.com/player/26/2366/grace-fisk' },
  { name: 'Fuka Nagano', id: '2013', rating: 75, url: 'https://www.wefut.com/player/26/2013/fuka-nagano' },
  { name: 'Gemma Evans', id: '2928', rating: 74, url: 'https://www.wefut.com/player/26/2928/gemma-evans' },
  { name: 'Lily Woodham', id: '2701', rating: 74, url: 'https://www.wefut.com/player/26/2701/lily-woodham' },
  { name: 'Marie Höbinger', id: '2671', rating: 74, url: 'https://www.wefut.com/player/26/2671/marie-hobinger' },
  { name: 'Cornelia Kapocs', id: '3536', rating: 73, url: 'https://www.wefut.com/player/26/3536/cornelia-kapocs' },
  { name: 'Leanne Kiernan', id: '3440', rating: 73, url: 'https://www.wefut.com/player/26/3440/leanne-kiernan' },
  { name: 'Stefan Bajcetic', id: '3161', rating: 73, url: 'https://www.wefut.com/player/26/3161/stefan-bajcetic' },
  { name: 'Samantha Kerr', id: '3750', rating: 72, url: 'https://www.wefut.com/player/26/3750/samantha-kerr' },
  { name: 'Aurélie Csillag', id: '21873', rating: 71, url: 'https://www.wefut.com/player/26/21873/aurelie-csillag' },
  { name: 'Owen Beck', id: '21429', rating: 70, url: 'https://www.wefut.com/player/26/21429/owen-beck' },
  { name: 'Jenna Clark', id: '5898', rating: 70, url: 'https://www.wefut.com/player/26/5898/jenna-clark' },
  { name: 'Lewis Koumas', id: '21961', rating: 69, url: 'https://www.wefut.com/player/26/21961/lewis-koumas' },
  { name: 'Giovanni Leoni', id: '7042', rating: 69, url: 'https://www.wefut.com/player/26/7042/giovanni-leoni' },
  { name: 'Mia Enderby', id: '6924', rating: 69, url: 'https://www.wefut.com/player/26/6924/mia-enderby' },
  { name: 'James McConnell', id: '22523', rating: 68, url: 'https://www.wefut.com/player/26/22523/james-mcconnell' },
  { name: 'Sofie Lundgaard', id: '8416', rating: 67, url: 'https://www.wefut.com/player/26/8416/sofie-lundgaard' },
  { name: 'Kirsty Maclean', id: '20386', rating: 66, url: 'https://www.wefut.com/player/26/20386/kirsty-maclean' },
  { name: 'Calvin Ramsay', id: '10599', rating: 65, url: 'https://www.wefut.com/player/26/10599/calvin-ramsay' },
  { name: 'Trey Nyoni', id: '11832', rating: 64, url: 'https://www.wefut.com/player/26/11832/trey-nyoni' },
  { name: 'Lucy Parry', id: '12693', rating: 63, url: 'https://www.wefut.com/player/26/12693/lucy-parry' },
  { name: 'Rhys Williams', id: '14619', rating: 61, url: 'https://www.wefut.com/player/26/14619/rhys-williams' },
  { name: 'Hannah Silcock', id: '15116', rating: 60, url: 'https://www.wefut.com/player/26/15116/hannah-silcock' },
  { name: 'Zara Shaw', id: '14986', rating: 60, url: 'https://www.wefut.com/player/26/14986/zara-shaw' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Create Liverpool directory in the project
  const projectDir = path.join(__dirname, 'Developer', '1x1-fc');
  const liverpoolDir = path.join(projectDir, 'Liverpool');
  if (!fs.existsSync(liverpoolDir)) {
    fs.mkdirSync(liverpoolDir, { recursive: true });
  }

  console.log(`Starting to capture ${players.length} Liverpool player cards...`);
  console.log(`Saving to: ${liverpoolDir}`);

  // Handle cookie banner on first page load
  let cookieBannerHandled = false;

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    try {
      console.log(`[${i + 1}/${players.length}] Processing ${player.name} (Rating: ${player.rating}, ID: ${player.id})...`);

      // Navigate to player page
      await page.goto(player.url, { waitUntil: 'networkidle' });

      // Handle cookie banner on first visit
      if (!cookieBannerHandled) {
        try {
          // Try common cookie banner selectors
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

      // Wait for content to load and any overlays to disappear
      await page.waitForTimeout(2000);

      // Find the player card image - try multiple selectors
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
            // Check if element is visible
            const isVisible = await cardElement.isVisible();
            if (isVisible) {
              // Wait a bit more for the card to fully render
              await page.waitForTimeout(500);

              // Filename format: PlayerName_Rating.png
              const filename = `${player.name.replace(/\s+/g, '_').replace(/'/g, '')}_${player.rating}.png`;
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
        // Fallback: screenshot a specific region where the card typically appears
        const filename = `${player.name.replace(/\s+/g, '_').replace(/'/g, '')}_${player.rating}.png`;
        await page.screenshot({
          path: path.join(liverpoolDir, filename),
          clip: { x: 150, y: 200, width: 300, height: 450 }
        });
        console.log(`  ✓ Saved region: ${filename}`);
      }

      // Small delay between requests to be respectful
      await page.waitForTimeout(1000);

    } catch (error) {
      console.error(`  ✗ Error processing ${player.name} (${player.id}):`, error.message);
    }
  }

  await browser.close();
  console.log(`\nComplete! Liverpool player cards saved to: ${liverpoolDir}`);
  console.log(`Total cards captured: ${players.length}`);
})();
