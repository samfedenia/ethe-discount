const puppeteer = require('puppeteer');
const { getBrowserPage, getPriceQuote, getTextFromSelector } = require('./utils');
const options = require('./options');

// Driver code

(async ({ URL, epsSelector }) => {
  const [page, browser] = await getBrowserPage(puppeteer, URL);
  const epsText = await getTextFromSelector(page, epsSelector);
  const eps = parseFloat(epsText.split('‡')[0]);
  await browser.close();

  const ethPrice = await getPriceQuote('ETH-USD');
  const ethePrice = await getPriceQuote('ETHE');
  const discount = 1 - ethePrice / ethPrice / eps;
  const data = {
    'Grayscale ETH Holdings Per Share': eps.toString(),
    'ETH-USD Price': '$ ' + ethPrice.toFixed(2),
    'ETHE-USD Price': '$ ' + ethePrice.toFixed(2),
    'Grayscale ETHE Discount': (discount * 100).toFixed(2) + ' %',
  };
  console.table(data);
})(options);
