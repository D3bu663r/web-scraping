async function extractProducts(browser) {
    let url = 'https://www.savegnago.com.br';

    let departments = [
        'hortifruti',
        'bebidas',
        'limpeza',
        'frios-laticinios-e-congelados',
        'higiene-e-saude-e-beleza',
        'pet-shop',
        'carnes',
        'mercearia',
        'padaria',
        'bazar-e-utilidades',
        'flores-e-plantas',
        'alimentos-saudaveis'
    ];

    let products = [];

    console.log('initiating extraction of the savegnago products\n');

    for (var department of departments) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(`${url}/${department}`);

        console.log(`extracting products from the ${department} department`);

        let data = await page.evaluate((department) => {
            let data = [];

            document.querySelectorAll('div.shelf__product-item[data-product-id]').forEach((element) => {
                let json = {};
                try {
                    json.domain = 'savegnago';
                    json.id = element.getAttribute('data-product-id');
                    json.department = department;
                    json.imageUrl = element.querySelector('a.product-item__img').querySelector('img').src;
                    json.name = element.querySelector('h3.product-item__title').innerText;
                    json.price = element.querySelector('div.product-item__best-price').innerText;
                }
                catch (exception) { }
                data.push(json);
            });

            return data;
        }, department);

        await page.close();
        console.log(`extracted ${data.length} products of the department ${department}\n`);
        products = products.concat(data);
    }
    console.log('finalized the extraction of the savegnago products\n');

    return products;
};

module.exports = extractProducts;