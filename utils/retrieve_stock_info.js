"use strict";
exports.__esModule = true;
var axios = require('axios');
var cheerio = require('cheerio');
var sanitize_stock_ticker = require('./sanitize_stock_ticker');
function retrieveStockInfo(ticker) {
    return new Promise(function (resolve, reject) {
        var sanitized_sticker = sanitize_stock_ticker.sanitizeStockTicker(ticker);
        var scrape_target_url = "https://www.alphaquery.com/stock/" + sanitized_sticker + "/volatility-option-statistics/180-day/iv-mean";
        axios.get(scrape_target_url)
            .then(function (response) {
            var response_html = response.data;
            var $ = cheerio.load(response_html);
            // Get the option-implied vol
            var target_div = $('#below-chart-text');
            var target_p = target_div.children().last();
            var p_string = target_p.text();
            var search_term = "Implied Volatility (Mean) of ";
            var substring_result = p_string.substring(p_string.indexOf(search_term));
            var option_implied_vol_string = substring_result.substring(substring_result.indexOf("0"), substring_result.indexOf("0") + 6);
            var opt_imp_vol_180d_pct = parseFloat(option_implied_vol_string);
            // Get the last stock price
            var last_price_string = $('#quote-price-container').text();
            var last_price_dollars = parseFloat(last_price_string);
            return resolve({
                success: true,
                data: {
                    ticker: ticker,
                    last_price_dollars: last_price_dollars,
                    opt_imp_vol_180d_pct: opt_imp_vol_180d_pct
                }
            });
        })["catch"](function (err) {
            return reject({
                success: false,
                data: {
                    message: err
                }
            });
        });
    });
}
var retrieve_stock_info = {
    retrieveStockInfo: retrieveStockInfo
};
module.exports = retrieve_stock_info;
