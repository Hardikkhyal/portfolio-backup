const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to check console logs...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[BROWSER ${type.toUpperCase()}]: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    console.error('[BROWSER RUNTIME ERROR]:', err.stack || err.message);
  });

  try {
    await page.goto('http://localhost:3000');
    // Wait for preloader to load and HMR to settle
    await page.waitForTimeout(3000);
    
    console.log('Scrolling down to y=1000...');
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(2000);
    
    console.log('Scrolling down to y=2000...');
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(2000);
    
  } catch (error) {
    console.error('Playwright execution error:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
