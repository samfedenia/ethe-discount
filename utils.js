const yFinance = require('yahoo-finance');

function logError(message) {
  console.error(message);
}

async function getTextFromSelector(page, selector) {
  try {
    let element = await page.waitForSelector(selector);
    const text = await page.evaluate((element) => element.textContent, element);
    return text;
  } catch (ex) {
    logError(`getTextFromSelector -> Error: ${ex.message}`);
  }
}

async function getPriceQuote(symbol) {
  try {
    return (
      await yFinance.quote({
        symbol,
        modules: ['price'],
      })
    ).price.regularMarketPrice;
  } catch (ex) {
    logError(`getPriceQuote -> Error: ${ex.message} in getPriceQuote`);
  }
}

async function getBrowserPage(puppeteer, URL) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(URL);
    return [page, browser];
  } catch (ex) {
    logError(`getBrowserPage -> Error: ${ex.message} in getBrowserPage`);
  }
}

module.exports = {
  getBrowserPage,
  getPriceQuote,
  getTextFromSelector,
};
