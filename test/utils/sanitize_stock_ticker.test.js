/**
 * @jest-environment node
 */

const sanitize_stock_ticker = require('../../utils/sanitize_stock_ticker')

const sanitizeErrorMsg = 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'


// Tests for sanitizeStockTicker
test('Sanitizes a ticker with leading $', () => {
    expect(sanitize_stock_ticker.sanitizeStockTicker('$tsla')).toBe('tsla')
})

test('Sanitizes a ticker with spaces', () => {
    expect(sanitize_stock_ticker.sanitizeStockTicker('ts la')).toBe('tsla')
})

test('Throws an error if ticker >5 chars', () => {
    expect(() => {
        sanitize_stock_ticker.sanitizeStockTicker('tslala');
    }).toThrowError(sanitizeErrorMsg)
})

test('Throws an error if ticker <1 chars', () => {
    expect(() => {
        sanitize_stock_ticker.sanitizeStockTicker('');
    }).toThrowError(sanitizeErrorMsg)
})

test('Applies length check only after removing $ and spaces', () => {
    expect(sanitize_stock_ticker.sanitizeStockTicker('$  tsla')).toBe('tsla')
})
