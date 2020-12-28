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

function retrieveStockInfo(ticker: string): Promise<stockInfoScrapeResult> {

    return new Promise((resolve, reject) => {
        let sanitized_sticker:string | Error = sanitize_stock_ticker.sanitizeStockTicker(ticker)
    
        let scrape_target_url:string  = `https://www.alphaquery.com/stock/${sanitized_sticker}/volatility-option-statistics/180-day/iv-mean`

        axios.get(scrape_target_url)
        .then(response => {
            let response_html = response.data

            console.log(response_html);
            const $ = cheerio.load(response_html);
            
            // Get the option-implied vol
            let target_div = $('#below-chart-text');
            let target_p = target_div.children().last();
            let p_string = target_p.text();
            let search_term = "Implied Volatility (Mean) of ";
            let substring_result = p_string.substring(p_string.indexOf(search_term))
            let option_implied_vol_string = substring_result.substring(substring_result.indexOf("0"),substring_result.indexOf("0") + 6)
            let opt_imp_vol_180d_pct = parseFloat(option_implied_vol_string);

            // Get the last stock price
            let last_price_string = $('#quote-price-container').text();
            let last_price_dollars = parseFloat(last_price_string)

            return resolve({
                success: true,
                data: {
                    ticker: ticker,
                    last_price_dollars: last_price_dollars,
                    opt_imp_vol_180d_pct: opt_imp_vol_180d_pct
                }
            });
        })
        //TODO: error from input isn't adhering to this format
        .catch(err => {
            return reject({
                success: false,
                data: {
                    message: err
                }
            });
        })
    })
}

const retrieve_stock_info = {
    retrieveStockInfo: retrieveStockInfo
};

module.exports = retrieve_stock_info;