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
        last_price_dollars: 661.77,
        opt_imp_vol_180d_pct: 0.6536,
        ticker: "tsla"
    }
}

// Tests for retrieveStockInfo
//TODO: function should be returning an object with this message within it, rather than just throwing the error
test('returns an error for invalid input of tslala', () => {
    expect.assertions(1);
    return expect(retrieve_stock_info.retrieveStockInfo('tslala'))
    .rejects.toEqual(new Error(sanitizeErrorMsg));
}) 

test('shows correct info for $tsla on 2020-12-24', () => {
    expect.assertions(1);
    return retrieve_stock_info.retrieveStockInfo('tsla')
    .then(result => {
        expect(result).toStrictEqual(tsla_response)
    });
}) 