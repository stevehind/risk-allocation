import { ModuleResolutionKind } from "typescript"
const axios = require('axios');
const cheerio = require('cheerio');

const sanitize_stock_ticker = require('./sanitize_stock_ticker')

interface stockInfoObject {
    ticker: string;
    last_price_dollars: number;
    opt_imp_vol_180d_pct: number;
}

interface scrapeFailure {
    message: string;
}

interface stockInfoScrapeResult {
    success: boolean;
    data: {
        ticker: string;
        last_price_dollars: number;
        opt_imp_vol_180d_pct: number;
    } | {
        message: string
    };
}

function scrapeStockPrice(ticker: string): Promise<number> {
    return new Promise((resolve, reject) => {
        let scrape_target_url = `https://www.alphaquery.com/stock/${ticker}/all-data-variables`
        
        axios.get(scrape_target_url)
        .then(response => {
            let response_html = response.data;

            const $ = cheerio.load(response_html)

            let target = $('a[name="Recent Price/Volume"]')
            let first_parent = target.parent();
            let second_parent = first_parent.parent();
            let next_sibling = second_parent.next();
            let last_child = next_sibling.children('.text-right');
            let last_child_text = last_child.text();
            let last_child_number = parseFloat(last_child_text)

            return resolve(last_child_number)
        })
        .catch(err => reject(console.error(err)))
    })
}

function scrapeOptImpVol(ticker: string): Promise<number> {
    return new Promise((resolve, reject) => {
        let scrape_target_url = `https://www.alphaquery.com/stock/${ticker}/volatility-option-statistics/180-day/historical-volatility`

        axios.get(scrape_target_url)
        .then(response => {
            let response_html = response.data;

            const $ = cheerio.load(response_html)

            let target = $('#indicator-iv-mean');
            let child  = target.children('.indicator-figure');
            let next_child = child.children('a');
            let further_child = next_child.children('.indicator-figure-inner');
            let option_implied_vol_string = further_child.text();
            let opt_imp_vol_180d_pct = parseFloat(option_implied_vol_string);

            return resolve(opt_imp_vol_180d_pct)
        })
        .catch(err => reject(console.error(err)))

    })
}

function retrieveStockInfo(ticker: string): Promise<stockInfoScrapeResult> {

    return new Promise((resolve, reject) => {
        let sanitized_ticker:string = sanitize_stock_ticker.sanitizeStockTicker(ticker)

        return retrieve_stock_info.scrapeStockPrice(sanitized_ticker)
        .then((price) => Promise.all([
            price,
            retrieve_stock_info.scrapeOptImpVol(sanitized_ticker)
        ]))
        .then(([price, vol]) => {
            return resolve({
                success: true,
                data: {
                    ticker: sanitized_ticker,
                    last_price_dollars: price,
                    opt_imp_vol_180d_pct: vol
                }
            })
        })
        .catch((error) => {
            return reject({
                success: false,
                data: {
                    message: error
                }
            })
        })
    })
}

const retrieve_stock_info = {
    scrapeStockPrice: scrapeStockPrice,
    scrapeOptImpVol: scrapeOptImpVol,
    retrieveStockInfo: retrieveStockInfo
};

module.exports = retrieve_stock_info;