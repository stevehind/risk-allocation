/**
 * @jest-environment node
 */

const { isExpressionWithTypeArguments } = require('typescript')
const retrieve_stock_info = require('../../utils/retrieve_stock_info')

const sanitizeErrorMsg = 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'

// TODO replace this was a mocked response
const tsla_response = {
    success: true,
    data: {
        last_price_dollars: 663.69,
        opt_imp_vol_180d_pct: 0.6549,
        ticker: "tsla"
    }
}

test('scrapes stock price', async(done) => {
    await retrieve_stock_info.scrapeStockPrice('tsla')
    .then(result => {
        expect(result).toStrictEqual(tsla_response.data.last_price_dollars)  
    })
    .finally(() => done());
})

test('scrapes imp vol', async(done) => {
    await retrieve_stock_info.scrapeOptImpVol('tsla')
    .then(result => {
        expect(result).toStrictEqual(tsla_response.data.opt_imp_vol_180d_pct)
    })
    .finally(() => done());
})

// Tests for retrieveStockInfo
//TODO: function should be returning an object with this message within it, rather than just throwing the error
test('returns an error for invalid input of tslala', async(done) => {
    await retrieve_stock_info.retrieveStockInfo('tslala')
    .then(result => {
        expect(result).toStrictEqual({
            success: false,
            data: {
                message: "Request failed with status code 404"
            }
        })
    })
    .finally(() => done());
}) 

test('shows correct info for $tsla on 2020-12-24', async(done) => {
    await retrieve_stock_info.retrieveStockInfo('tsla')
    .then(result => {
        expect(result).toStrictEqual(tsla_response)
    })
    .finally(() => done());
}) 