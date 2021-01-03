import { ModuleResolutionKind } from "typescript"
const axios = require('axios');
const cheerio = require('cheerio');

import sanitize_stock_ticker from './sanitize_stock_ticker'

export interface singleStockInfo {
    enriched: boolean;
    ticker: string;
    portfolio?: boolean;
    last_price_dollars?: number;
    opt_imp_vol_180d_pct?: number;
    shares_owned?: number;
    capital_invested?: number;
    capital_share?: number;
    one_sigma_risk?: number;
    risk_share?: number;
    error_message?: string;
}

interface stockInfoScrapeSuccessResult {
    success: boolean;
    data: singleStockInfo;
}

interface stockInfoScrapeFailureResult {
    success: boolean;
    data: {
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
        .catch(err => {
            if (err.message === "Request failed with status code 404") {
                return reject ({
                    error_message: 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'
                })
            } else {
                return reject({
                    error_message: err.message
                })
            }
        })
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
        .catch(err => {
            if (err.message === "Request failed with status code 404") {
                return reject ({
                    error_message: 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'
                })
            } else {
                return reject({
                    error_message: err.message
                })
            }
        })
    })
}

function retrieveStockInfo(ticker: string): Promise<stockInfoScrapeSuccessResult | stockInfoScrapeFailureResult> {

    return new Promise((resolve, reject) => {
        let sanitized_ticker:string = sanitize_stock_ticker.sanitizeStockTicker(ticker)

        return retrieve_stock_info.scrapeStockPrice(sanitized_ticker)
        .then((price) => Promise.all([
            price,
            retrieve_stock_info.scrapeOptImpVol(sanitized_ticker)
        ]))
        .then(([price, vol]) => {
            let success_result: stockInfoScrapeSuccessResult = {
                success: true,
                data: {
                    ticker: sanitized_ticker,
                    last_price_dollars: price,
                    opt_imp_vol_180d_pct: vol,
                    enriched: true
                }
            }
            
            return resolve(success_result)
        })
        .catch((error) => {
            let failure_result: stockInfoScrapeFailureResult = {
                success: false,
                data: error
            }
            return resolve(failure_result)
        })
    })
}

const retrieve_stock_info = {
    scrapeStockPrice: scrapeStockPrice,
    scrapeOptImpVol: scrapeOptImpVol,
    retrieveStockInfo: retrieveStockInfo
};

export default retrieve_stock_info;