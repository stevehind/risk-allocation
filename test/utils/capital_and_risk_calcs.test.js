/**
 * @jest-environment node
 */

const { TestScheduler } = require('jest')
const capital_and_risk_calcs = require('../../utils/capital_and_risk_calcs')

const test_submitted_info_single = {
    ticker: 'tsla',
    shares_owned: 10
}

const test_stock_info_without_totals = {
    ticker: 'tsla',
    shares_owned: 10,
    last_price_dollars: 500,
    enriched: true
}

const test_submitted_info_array = [
    {
        ticker: 'tsla',
        shares_owned: 10
    },
    {
        ticker: 'fb',
        shares_owned: 10
    }
]

const test_submitted_info_array_with_invalid_ticker = [
    {
        ticker: 'tsla',
        shares_owned: 10
    },
    {
        ticker: 'tslala',
        shares_owned: 10
    }
]

const test_stock_info_array_with_errors = [
    {
        capital_invested: 6636.900000000001,
        enriched: true,
        last_price_dollars: 663.69,
        opt_imp_vol_180d_pct: 0.6549,
        shares_owned: 10,
        ticker: "tsla",
        portfolio: false
    },
    {
        enriched: false,
        shares_owned: 10,
        ticker: "tslala",
        portfolio: false
    }
]

const test_stock_info_result_array = [
    {
        capital_invested: 6636.900000000001,
        enriched: true,
        last_price_dollars: 663.69,
        opt_imp_vol_180d_pct: 0.6549,
        shares_owned: 10,
        ticker: "tsla",
        portfolio: false
    },
    {
        capital_invested: 2770,
        enriched: true,
        last_price_dollars: 277,
        opt_imp_vol_180d_pct: 0.3658,
        shares_owned: 10,
        ticker: "fb",
        portfolio: false
    }
]

const sanitizeErrorMsg = 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'

const test_stock_info_result_array_handling_errors = [
    {
        capital_invested: 6636.900000000001,
        enriched: true,
        last_price_dollars: 663.69,
        opt_imp_vol_180d_pct: 0.6549,
        shares_owned: 10,
        ticker: "tsla",
        portfolio: false
    },
    {
        ticker: "tslala",
        enriched: false,
        error_message: new Error (sanitizeErrorMsg)
    }
]

const test_stock_info_array_unportfoliod = [
    {
        ticker: 'tsla',
        last_price_dollars: 10.0,
        opt_imp_vol_180d_pct: 0.5,
        shares_owned: 5.0,
        capital_invested: 50.0,
        enriched: true,
        portfolio: false
    },
    {
        ticker: 'fb',
        last_price_dollars: 50.0,
        opt_imp_vol_180d_pct: 0.25,
        shares_owned: 3.0,
        capital_invested: 150.0,
        enriched: true,
        portfolio: false
    }
]

const test_stock_info_array_unportfoliod_with_invalid_input = [
    {
        ticker: 'tsla',
        last_price_dollars: 10.0,
        opt_imp_vol_180d_pct: 0.5,
        shares_owned: 5.0,
        capital_invested: 50.0,
        enriched: true,
        portfolio: false
    },
    {
        ticker: 'tslala',
        shares_owned: 3.0,
        enriched: false,
        portfolio: false
    }
]

const test_stock_info_array_portfoliod = [
    {
        ticker: 'tsla',
        last_price_dollars: 10.0,
        opt_imp_vol_180d_pct: 0.5,
        shares_owned: 5.0,
        capital_invested: 50.0,
        capital_share: 0.25,
        risk_share: 0.40,
        one_sigma_risk: 25,
        portfolio: true,
        enriched: true
    },
    {
        ticker: 'fb',
        last_price_dollars: 50.0,
        opt_imp_vol_180d_pct: 0.25,
        shares_owned: 3.0,
        capital_invested: 150.0,
        capital_share: 0.75,
        risk_share: 0.60,
        one_sigma_risk: 37.5,
        portfolio: true,
        enriched: true
    }
]

const test_stock_info_array_portfoliod_with_invalid_input = [
    {
        ticker: 'tsla',
        last_price_dollars: 10.0,
        opt_imp_vol_180d_pct: 0.5,
        shares_owned: 5.0,
        capital_invested: 50.0,
        enriched: true,
        portfolio: true,
        capital_share: 1.0,
        risk_share: 1.0,
        one_sigma_risk: 25.0
    },
    {
        ticker: 'tslala',
        shares_owned: 3.0,
        enriched: false,
        portfolio: false
    }
]

const tsla_stock_info = {
    ticker: 'tsla',
    last_price_dollars: 663.69,
    opt_imp_vol_180d_pct: 0.6549,
    shares_owned: 10,
    capital_invested: 6636.900000000001,
    enriched: true,
    portfolio: false
}

// Test capitalInvested
test('It calculates 10 shares at $10.00 to be $100.00', () => {
    expect(capital_and_risk_calcs.capitalInvested(test_stock_info_without_totals)).toBe(5000.0)
})

test('It handles missing stock price data', () => {
    expect(capital_and_risk_calcs.capitalInvested(test_stock_info_array_with_errors[1].shares_owned, test_stock_info_array_with_errors[1].last_price_dollars))
    .toBe(0)
})

// Test capitalTotal
test('calculates total capital in portfolio', () => {
    expect(capital_and_risk_calcs.capitalTotal(test_stock_info_array_unportfoliod)).toBe(200.0)
})

test('calculates total capital in portfolio, ignoring NaN values', () => {
    expect(capital_and_risk_calcs.capitalTotal(test_stock_info_array_unportfoliod_with_invalid_input)).toBe(50.0)
})

// Test capitalShare
test("calculates one stock's share of capital in portfolio", () => {
    expect(capital_and_risk_calcs.capitalShare('tsla', test_stock_info_array_unportfoliod))
    .toBe(0.25)
})

test("it calculates one stock's share when one of two provided stocks is invalid", () => {
    expect(capital_and_risk_calcs.capitalShare('tslala', test_stock_info_array_unportfoliod_with_invalid_input))
    .toBe(0)
})

// Test oneSigmaRiskDollars
test('calculates dollar value of one sigma move in a stock', () => {
    expect(capital_and_risk_calcs.oneSigmaRiskDollars(test_stock_info_array_unportfoliod[0]))
    .toBe(25.0)
})

// Test riskTotal
test('calculates total risk across portfolio', () => {
    expect(capital_and_risk_calcs.riskTotal(test_stock_info_array_unportfoliod))
    .toBe(62.5)
})

// Test riskShare
test("calculates one stock's share of risk in portfolio", () => {
    expect(capital_and_risk_calcs.riskShare('tsla', test_stock_info_array_unportfoliod))
    .toBe(0.4)
})

test("calculates risk as 0 where there is an invalid input", () => {
    expect(capital_and_risk_calcs.riskShare('tslala', test_stock_info_array_unportfoliod_with_invalid_input))
    .toBe(0)
})

// Test createSingleStockInfo
test('Creates stock info object from submitted holdings', async() => {
    expect(
        await capital_and_risk_calcs.createSingleStockInfo(test_submitted_info_single)
        .then(result => result)
        .catch(error => error)
    ).toStrictEqual(tsla_stock_info)
})

// Test createStockInfoFromHoldings
test('Creates stock info objects for an array of submitted holdings', async() => {
    expect(
        await capital_and_risk_calcs.createStockInfoFromHoldings(test_submitted_info_array)
        .then(result => result)
        .catch(error => error)
    ).toStrictEqual(test_stock_info_result_array)
})

test('gracefully handles one element of submitted portfolio being invalid', async() => {
    expect(
        await capital_and_risk_calcs.createStockInfoFromHoldings(test_submitted_info_array_with_invalid_ticker)
        .then(result => result)
        .catch(error => error)
    ).toStrictEqual(test_stock_info_result_array_handling_errors)
})

// Test create portfolio
test('enriches a portfolio with capital, capital_share and risk_share', () => {
    expect(capital_and_risk_calcs.createPortfolio(test_stock_info_array_unportfoliod)).toStrictEqual(test_stock_info_array_portfoliod)
})

test('it enriches a portfolio and gracefully handles an invalid ticker', () => {
    expect(capital_and_risk_calcs.createPortfolio(test_stock_info_array_unportfoliod_with_invalid_input)).toStrictEqual(test_stock_info_array_portfoliod_with_invalid_input)
})