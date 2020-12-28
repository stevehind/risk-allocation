"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios = require('axios');
var cheerio = require('cheerio');
var puppeteer = require('puppeteer');
var sanitize_stock_ticker = require('./sanitize_stock_ticker');
function scrapeWithPuppeteer(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer.launch()];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(url)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(1000)
                            .then(function () {
                            return page.content()
                                .then(function (result) {
                                return result;
                            });
                        })];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function retrieveStockInfoPuppeteer(ticker) {
    return new Promise(function (resolve, reject) {
        var sanitized_sticker = sanitize_stock_ticker.sanitizeStockTicker(ticker);
        var scrape_target_url = "https://www.alphaquery.com/stock/" + sanitized_sticker + "/volatility-option-statistics/180-day/iv-mean";
        // Navigate to the page and scrape it
        return scrapeWithPuppeteer(scrape_target_url)
            .then(function (html_result) {
            var $ = cheerio.load(html_result);
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
    scrapeWithPuppeteer: scrapeWithPuppeteer,
    retrieveStockInfoPuppeteer: retrieveStockInfoPuppeteer,
    retrieveStockInfo: retrieveStockInfo
};
module.exports = retrieve_stock_info;
