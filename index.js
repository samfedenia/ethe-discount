const puppeteer = require('puppeteer');
const { getBrowserPage, getPriceQuote, getTextFromSelector } = require('./utils');
const options = require('./options');

// Driver code

(async ({ URL, sharesSelector, epsSelector }) => {
  const [page, browser] = await getBrowserPage(puppeteer, URL);
  const sharesText = await getTextFromSelector(page, sharesSelector);
  const epsText = await getTextFromSelector(page, epsSelector);
  const shares = parseInt(sharesText.split('‡')[0].replace(',', '').replace(',', ''));
  const eps = parseFloat(epsText.split('‡')[0]);
  await browser.close();

  const ethPrice = await getPriceQuote('ETH-USD');
  const ethePrice = await getPriceQuote('ETHE');

  const discount = 1 - ((ethePrice / ethPrice) * shares) / (shares * eps);

  console.log('Grayscale Shares Outstanding: ', shares);
  console.log('Grayscale ETH Holdings Per Share: ', eps);
  console.log('ETH-USD Price: ', ethPrice);
  console.log('ETHE-USD Price: ', ethePrice);
  console.log('\nGrayscale ETHE Discount: ', (discount * 100).toFixed(2) + '%');
})(options);
