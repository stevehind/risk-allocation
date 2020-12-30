function sanitizeStockTicker(ticker: string): string {
    let ticker_as_string = ticker.toString();
    let ticker_without_spaces = ticker_as_string.replace(/\s+/g, "");

    function removeDollarSigns(ticker: string): string {
        if (ticker.charAt(0) === '$') {
            return ticker.substring(1);
        } else {
            return ticker;
        }
    }

    let ticker_without_dollar_sign = removeDollarSigns(ticker_without_spaces);

    if (ticker_without_dollar_sign.length >= 1 && ticker_without_dollar_sign.length <= 5 ) {
        return ticker_without_dollar_sign
    } else {
        return 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'
    }

}

const sanitize_stock_ticker = {
    sanitizeStockTicker: sanitizeStockTicker
};

module.exports = sanitize_stock_ticker;