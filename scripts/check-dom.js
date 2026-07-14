const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to check DOM styles...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);

    console.log('Scrolling to y=1500...');
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(2000);

    const overlays = await page.evaluate(() => {
      // Find the container with z-20 (our Overlay component)
      const container = document.querySelector('.z-20');
      if (!container) return 'Overlay container not found';

      return Array.from(container.children).map((child, idx) => {
        const styleAttr = child.getAttribute('style') || 'No style attribute';
        const className = child.className || 'No class';
        const innerTextPreview = child.innerText ? child.innerText.substring(0, 100).replace(/\n/g, ' ') : '';
        const computedStyle = window.getComputedStyle(child);
        return {
          layer: idx + 1,
          innerTextPreview,
          styleAttr,
          computedOpacity: computedStyle.opacity,
          computedTransform: computedStyle.transform,
          computedDisplay: computedStyle.display,
        };
      });
    });

    console.log('DOM Overlay Elements at y=1500:');
    console.log(JSON.stringify(overlays, null, 2));

  } catch (err) {
    console.error('Error checking DOM:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
