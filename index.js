const puppeteer = require('puppeteer');
const yFinance = require('yahoo-finance');

options = {
  URL: 'https://grayscale.com/products/grayscale-ethereum-trust',
  sharesSelector: `\
body > div > div > section.elementor-section.elementor-top-section.elementor-element\
.elementor-element-6a51be1.gs-default-container\
.gs-product-table-overview.overview.elementor-section-boxed\
.elementor-section-height-default.elementor-section-height-default\
.jet-parallax-section > div.elementor-container.elementor-column-gap-default\
 > div > div.elementor-column.elementor-col-50.elementor-top-column\
.elementor-element.elementor-element-749bb5d > div > div > section\
.elementor-section.elementor-inner-section.elementor-element\
.elementor-element-e6203e7.elementor-section-height-min-height\
.elementor-section-boxed.elementor-section-height-default\
.jet-parallax-section > div.elementor-container.elementor-column-gap-default\
 > div > div > div > div > div.elementor-element.elementor-element-878cc4b\
.elementor-widget__width-initial.elementor-widget-mobile__width-inherit\
.elementor-widget.elementor-widget-jet-listing-dynamic-field.is-mac\
 > div > div > div > p > span\
`,
  epsSelector: `\
body > div > div > section.elementor-section.elementor-top-section\
.elementor-element.elementor-element-6a51be1.gs-default-container\
.gs-product-table-overview.overview.elementor-section-boxed\
.elementor-section-height-default.elementor-section-height-default\
.jet-parallax-section > div.elementor-container.elementor-column-gap-default\
 > div > div.elementor-column.elementor-col-50.elementor-top-column\
.elementor-element.elementor-element-749bb5d > div > div > section\
.elementor-section.elementor-inner-section.elementor-element\
.elementor-element-7b2733f.elementor-section-height-min-height\
.elementor-section-boxed.elementor-section-height-default\
.jet-parallax-section > div.elementor-container.elementor-column-gap-default\
 > div > div > div > div > div.elementor-element.elementor-element-223669c\
.elementor-widget__width-initial.elementor-widget-mobile__width-inherit\
.dc-has-condition.dc-condition-equal.elementor-widget\
.elementor-widget-jet-listing-dynamic-field.is-mac > div > div > div > p > span\
`,
};

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
    const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
    const page = await browser.newPage();
    await page.goto(URL);
    return [page, browser];
  } catch (ex) {
    logError(`getBrowserPage -> Error: ${ex.message} in getBrowserPage`);
  }
}

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
