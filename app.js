const puppeteer = require('puppeteer');
const fs = require('fs');
const extractProductsFromSavegnago = require('./data-extractor/savegnago.extractor');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    const products = await extractProductsFromSavegnago(browser);
    fs.writeFileSync('data.json', JSON.stringify(products, null, 2));

    console.log(`extracted ${products.length} products`);

    await browser.close();
})();

