"use strict";
exports.__esModule = true;
var axios = require('axios');
var cheerio = require('cheerio');
var sanitize_stock_ticker = require('./sanitize_stock_ticker');
function scrapeStockPrice(ticker) {
    return new Promise(function (resolve, reject) {
        var scrape_target_url = "https://www.alphaquery.com/stock/" + ticker + "/all-data-variables";
        axios.get(scrape_target_url)
            .then(function (response) {
            var response_html = response.data;
            var $ = cheerio.load(response_html);
            var target = $('a[name="Recent Price/Volume"]');
            var first_parent = target.parent();
            var second_parent = first_parent.parent();
            var next_sibling = second_parent.next();
            var last_child = next_sibling.children('.text-right');
            var last_child_text = last_child.text();
            var last_child_number = parseFloat(last_child_text);
            return resolve(last_child_number);
        })["catch"](function (err) {
            if (err.message === "Request failed with status code 404") {
                return reject({
                    error_message: 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'
                });
            }
            else {
                return reject({
                    error_message: err.message
                });
            }
        });
    });
}
function scrapeOptImpVol(ticker) {
    return new Promise(function (resolve, reject) {
        var scrape_target_url = "https://www.alphaquery.com/stock/" + ticker + "/volatility-option-statistics/180-day/historical-volatility";
        axios.get(scrape_target_url)
            .then(function (response) {
            var response_html = response.data;
            var $ = cheerio.load(response_html);
            var target = $('#indicator-iv-mean');
            var child = target.children('.indicator-figure');
            var next_child = child.children('a');
            var further_child = next_child.children('.indicator-figure-inner');
            var option_implied_vol_string = further_child.text();
            var opt_imp_vol_180d_pct = parseFloat(option_implied_vol_string);
            return resolve(opt_imp_vol_180d_pct);
        })["catch"](function (err) {
            if (err.message === "Request failed with status code 404") {
                return reject({
                    error_message: 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'
                });
            }
            else {
                return reject({
                    error_message: err.message
                });
            }
        });
    });
}
function retrieveStockInfo(ticker) {
    return new Promise(function (resolve, reject) {
        var sanitized_ticker = sanitize_stock_ticker.sanitizeStockTicker(ticker);
        return retrieve_stock_info.scrapeStockPrice(sanitized_ticker)
            .then(function (price) { return Promise.all([
            price,
            retrieve_stock_info.scrapeOptImpVol(sanitized_ticker)
        ]); })
            .then(function (_a) {
            var price = _a[0], vol = _a[1];
            var success_result = {
                success: true,
                data: {
                    ticker: sanitized_ticker,
                    last_price_dollars: price,
                    opt_imp_vol_180d_pct: vol,
                    enriched: true
                }
            };
            return resolve(success_result);
        })["catch"](function (error) {
            var failure_result = {
                success: false,
                data: error
            };
            return resolve(failure_result);
        });
    });
}
var retrieve_stock_info = {
    scrapeStockPrice: scrapeStockPrice,
    scrapeOptImpVol: scrapeOptImpVol,
    retrieveStockInfo: retrieveStockInfo
};
exports["default"] = retrieve_stock_info;
