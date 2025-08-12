const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

// Check if we're in a serverless environment
const isServerless = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL;

async function testPuppeteer() {
  console.log('Testing Puppeteer configuration...');
  console.log('Environment:', isServerless ? 'Serverless' : 'Development');
  
  try {
    let launchOptions;
    
    if (isServerless) {
      console.log('Using @sparticuz/chromium for serverless environment...');
      const executablePath = await chromium.executablePath();
      console.log('Chromium executable path:', executablePath);
      
      launchOptions = {
        headless: chromium.headless,
        executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        ignoreHTTPSErrors: true
      };
    } else {
      console.log('Using system Chrome for development...');
      // Try to find Chrome in common locations
      const possiblePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.CHROME_PATH
      ].filter(Boolean);
      
      let executablePath;
      for (const path of possiblePaths) {
        try {
          const fs = require('fs');
          if (fs.existsSync(path)) {
            executablePath = path;
            console.log('Found Chrome at:', path);
            break;
          }
        } catch (e) {
          // Continue to next path
        }
      }
      
      if (!executablePath) {
        throw new Error('Chrome not found. Please install Chrome or set CHROME_PATH environment variable.');
      }
      
      launchOptions = {
        headless: 'new',
        executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      };
    }
    
    const browser = await puppeteer.launch(launchOptions);
    
    console.log('✅ Browser launched successfully!');
    
    const page = await browser.newPage();
    console.log('✅ Page created successfully!');
    
    await page.goto('https://www.google.com');
    console.log('✅ Navigated to Google successfully!');
    
    const title = await page.title();
    console.log('Page title:', title);
    
    await browser.close();
    console.log('✅ Browser closed successfully!');
    console.log('🎉 Puppeteer test completed successfully!');
    
  } catch (error) {
    console.error('❌ Puppeteer test failed:', error.message);
    process.exit(1);
  }
}

testPuppeteer();
