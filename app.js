const puppeteer = require('puppeteer');
const app = require('express')();
const fs = require('fs');
const extractProductsFromSavegnago = require('./data-extractor/savegnago.extractor');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    const products = await extractProductsFromSavegnago(browser);
    fs.writeFileSync('data.json', JSON.stringify(products, null, 2));

    console.log(`extracted ${products.length} products`);

    await browser.close();
})();

app.use((req, res, next) => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
        if (err) res.json(err);
        res.json(JSON.parse(data));
    });
});

app.listen(process.env.PORT || 8080);
