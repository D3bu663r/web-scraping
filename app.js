const puppeteer = require('puppeteer');
const fs = require('fs');
const extractProductsFromSavegnago = require('./data-extractor/savegnago.extractor');

(async () => {
    const browser = await puppeteer.launch({ headless: false });

    const products = await extractProductsFromSavegnago(browser);
    fs.writeFileSync('data.json', JSON.stringify(products, null, 2));

    await browser.close();
})();

