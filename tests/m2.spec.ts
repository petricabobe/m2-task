import {Page, expect, test} from "@playwright/test";

test('print coin symbol from market list', async ({ page }) => {
    await page.goto('https://www.m2.com/en_AE/');
    const responsePromise = page.waitForResponse(response => response.url().includes('/coinSymbol/list'));
    await page.getByTestId('menu-markets').click();
    const response = await responsePromise;
    const responseBody = await response.json();
    expect(response.status()).toBe(200);

    console.log(responseBody.data.coinSymbolList);
});

test('verify sorting on Wallets page',async ({page}) => {
    await page.goto('https://www.m2.com/en_AE/wallets');

    //sort
    await page.getByTestId('sort-price').getByRole('link', { name: 'Price' }).click();
    const sortingArrow = page.getByTestId('sort-price').locator('svg').nth(1);
    const color = await sortingArrow.evaluate((e) => {
        return window.getComputedStyle(e).getPropertyValue("fill");
    })
    console.log(color);
    //expect 2nd arrow to be different color: fill: rgb(176, 176, 176);
    expect(color).not.toBe('rgb(176, 176, 176)');
    // if 2nd arrow is enabled -> values are sorted descending

    let sortedData = await getPriceColumnValue(page);
    console.log('Descending sorted list of price:', sortedData);

    expect(sortedData.sort((n1,n2)=> n2 - n1)).toEqual(sortedData);
    
})

async function getPriceColumnValue(page:Page) {
    const columndata = await page.locator('[data-testid^="coin-list-item"] > div > div[type="medium"]').allTextContents();
    console.log('Original dolar prices: ',columndata);
    let numericArray: number[] = [];
    columndata.forEach((e, i) => {
        columndata[i] = e.slice(1);
        numericArray[i] = parseFloat(columndata[i].replace(/,/g, ''));
    });
    return numericArray;
}