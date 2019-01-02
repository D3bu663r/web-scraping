async function isVisible(page, selector) {
    return await page.evaluate((selector) => {
        const node = document.querySelector(selector);
        if (!node)
            return false;
        const style = window.getComputedStyle(node);
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }, selector);
}

async function scrollInto(page, selector) {
    return await page.evaluate((selector) => {
        document.querySelector(selector).scrollIntoView();
    }, selector);
}

module.exports = {
    isVisible: isVisible,
    scrollInto: scrollInto
}
