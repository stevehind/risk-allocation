/**
 * @jest-environment node
 */

const { isExpressionWithTypeArguments } = require('typescript')
const cheerio = require('cheerio')
const retrieve_stock_info = require('../../utils/retrieve_stock_info')

const sanitizeErrorMsg = 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'

// TODO replace this was a mocked response
const tsla_response = {
    success: true,
    data: {
        last_price_dollars: 661.77,
        opt_imp_vol_180d_pct: 0.6536,
        ticker: "tsla"
    }
}

// Tests for scrapeWithPuppeteer
// test('it scrapes the target page, leaving time for data to load', async() => {
//     expect(
//         await retrieve_stock_info.scrapeWithPuppeteer('https://www.alphaquery.com/stock/TSLA/volatility-option-statistics/30-day/historical-volatility')
//         .then(result => {
//             const $ = cheerio.load(result);
//             let last_price_string = $('#quote-price-container').text();
//             let last_price_dollars = parseFloat(last_price_string)

//             return last_price_dollars
//         })
//     ).toBe('661.7')
// })

// test('it dumps the different page to get prices from', async() => {
//     expect(
//         await retrieve_stock_info.scrapeWithPuppeteer('https://www.alphaquery.com/stock/TSLA/all-data-variables')
//         .then(result => {
//             const $ = cheerio.load(result);
//             let target = $('a[name="Recent Price/Volume"]')
//             let first_parent = target.parent();
//             let second_parent = first_parent.parent();
//             let next_sibling = second_parent.next();
//             let last_child = next_sibling.children(); //'td[class=text-right]'
//             console.log(last_child)
//             let last_child_text = last_child.text();
//             return last_child_text;
//         })
//         .catch(err => console.error(err))
//     ).toBe('661.77')
// })

// var category = $('span').filter(function() {
//     return $(this).text().trim() === 'Category:';
//   }).next().text();


// Tests for retrieveStockInfo
//TODO: function should be returning an object with this message within it, rather than just throwing the error
// test('returns an error for invalid input of tslala', () => {
//     expect.assertions(1);
//     return expect(retrieve_stock_info.retrieveStockInfoPuppeteer('tslala'))
//     .rejects.toEqual(new Error(sanitizeErrorMsg));
// }) 

// test('shows correct info for $tsla on 2020-12-24', () => {
//     expect.assertions(1);
//     return retrieve_stock_info.retrieveStockInfoPuppeteer('tsla')
//     .then(result => {
//         expect(result).toStrictEqual(tsla_response)
//     });
// }) 