const util = require('../utils/util');

async function extractProducts(browser) {
    let url = 'https://www.savegnago.com.br';

    let departments = [
        'hortifruti', //418 produtos
        'bebidas', //612 produtos
        'limpeza', //612 produtos
        'frios-laticinios-e-congelados', //612 produtos
        'higiene-e-saude-e-beleza', //612 produtos
        'pet-shop', //248 produtos
        'carnes', //224 produtos
        'mercearia', //612 produtos
        'padaria', //389 produtos
        'bazar-e-utilidades', //612 produtos
        'flores-e-plantas', //80 produtos
        'alimentos-saudaveis' //237 produtos
    ];

    let products = [];

    console.info('initiating extraction of the savegnago products\n');

    for (var department of departments) {
        try {
            const page = await browser.newPage();
            await page.goto(`${url}/${department}`, { waitUntil: 'networkidle0', timeout: 120000 });

            console.info(`${department} department page loaded\n`);

            while (await util.isVisible(page, 'div.avantiSearch-load-more.btn.btn-primary')) {
                try {
                    await page.click('div.avantiSearch-load-more.btn.btn-primary');
                    await page.waitForFunction(selector => document.querySelector(selector) === null, {}, 'div.avantiSearch-load-more.btn.btn-primary.loading');
                } catch (error) {
                    break;
                }
            }

            console.info(`\nextracting products from the ${department} department`);

            let data = await page.evaluate(department => {
                let data = [];

                document.querySelectorAll('div.shelf__product-item[data-product-id]').forEach((element) => {
                    let json = {};
                    try {
                        json.domain = 'savegnago';
                        json.productId = element.getAttribute('data-product-id');
                        json.department = department;
                        json.imageUrl = element.querySelector('a.product-item__img > img').src;
                        json.name = element.querySelector('h3.product-item__title').innerText;
                        json.price = element.querySelector('div.product-item__best-price').innerText;
                    }
                    catch (exception) { }
                    data.push(json);
                });

                return data;
            }, department);

            await page.close();
            console.info(`extracted ${data.length} products of the department ${department}\n`);
            products = products.concat(data);
        } catch (error) {
            console.error(`Error loading page from department ${department}\n`);
            continue;
        }
    }
    console.info('finalized the extraction of the savegnago products\n');

    return products;
};

module.exports = extractProducts;