/**
 * @jest-environment node
 */

const { TestScheduler } = require('jest')
const { JsxEmit } = require('typescript')
import capital_and_risk_calcs from '../../utils/capital_and_risk_calcs'

const tsla_stock_info_20200108 = {
    ticker: 'tsla',
    verbose_name: 'Tesla, Inc. (TSLA)',
    last_price_dollars: 880.02,
    opt_imp_vol_180d_pct: 0.7888,
    shares_owned: 10,
    capital_invested: 8800.2,
    one_sigma_risk: 6941.59776,
    enriched: true,
    portfolio: false
}

const fb_stock_info_20200108 = {
    capital_invested: 2675.7,
    one_sigma_risk: 989.47386,
    enriched: true,
    last_price_dollars: 267.57,
    opt_imp_vol_180d_pct: 0.3698,
    shares_owned: 10,
    ticker: "fb",
    verbose_name: 'Facebook, Inc. (FB)',
    portfolio: false
}

const test_submitted_info_single = {
    ticker: 'tsla',
    shares_owned: 10
}

const test_submitted_info_single_invalid_ticker = {
    ticker: 'tslala',
    shares_owned: 10
}

const sanitizeErrorMsg = 'This is probably not a valid stock ticker. Tickers should be 1-5 characters, excluding white spaces and leading $ character.'

const test_single_stock_info_invalid_ticker = {
    enriched: false,
    error_message: sanitizeErrorMsg,
    ticker: "tslala"
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
    tsla_stock_info_20200108,
    {
        enriched: false,
        shares_owned: 10,
        ticker: "tslala",
        portfolio: false
    }
]

const test_stock_info_result_array = [
    tsla_stock_info_20200108,
    fb_stock_info_20200108
]

const test_stock_info_result_array_handling_errors = [
    tsla_stock_info_20200108,
    {
        ticker: "tslala",
        enriched: false,
        error_message: sanitizeErrorMsg
    }
]

const test_stock_info_array_unportfoliod = [
    {
        ticker: 'tsla',
        verbose_name: 'Tesla, Inc. (TSLA)',
        last_price_dollars: 10.0,
        opt_imp_vol_180d_pct: 0.5,
        shares_owned: 5.0,
        capital_invested: 50.0,
        enriched: true,
        portfolio: false
    },
    {
        ticker: 'fb',
        verbose_name: 'Facebook, Inc. (FB)',
        last_price_dollars: 50.0,
        opt_imp_vol_180d_pct: 0.25,
        shares_owned: 3.0,
        capital_invested: 150.0,
        enriched: true,
        portfolio: false
    }
]

const test_stock_info_array_unportfoliod_short = [
    {
        ticker: 'tsla',
        verbose_name: 'Tesla, Inc. (TSLA)',
        last_price_dollars: 10.0,
        opt_imp_vol_180d_pct: 0.5,
        shares_owned: -5.0,
        capital_invested: -50.0,
        enriched: true,
        portfolio: false
    },
    {
        ticker: 'fb',
        verbose_name: 'Facebook, Inc. (FB)',
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
        verbose_name: 'Tesla, Inc. (TSLA)',
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
        verbose_name: 'Tesla, Inc. (TSLA)',
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
        verbose_name: 'Facebook, Inc. (FB)',
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
        verbose_name: 'Tesla, Inc. (TSLA)',
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

test('returns a positive number when given a short position', () => {
    expect(capital_and_risk_calcs.oneSigmaRiskDollars(test_stock_info_array_unportfoliod_short[0]))
    .toBe(25.0)
})

// Test riskTotal
test('calculates total risk across portfolio', () => {
    expect(capital_and_risk_calcs.riskTotal(test_stock_info_array_unportfoliod))
    .toBe(62.5)
})


test("calculates negative risk and positive risk as their sbolute sum", () => {
    expect(capital_and_risk_calcs.riskTotal(test_stock_info_array_unportfoliod_short))
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
test('Creates stock info object from submitted holdings', async(done) => {
    await capital_and_risk_calcs.createSingleStockInfo(test_submitted_info_single)
    .then(result => {
        expect(result).toStrictEqual(tsla_stock_info_20200108)
    })
    .catch(err => console.error(err))
    .finally(() => done());
})

test('fails to create stock info object from submitted holdings with invalid ticker', async(done) => {
    await capital_and_risk_calcs.createSingleStockInfo(test_submitted_info_single_invalid_ticker)
    .then(result => {
        expect(result).toStrictEqual(test_single_stock_info_invalid_ticker)
    })
    .catch(err => console.error(err))
    .finally(() => done());
})


// Test createStockInfoFromHoldings
test('Creates stock info objects for an array of submitted holdings', async(done) => {
    await capital_and_risk_calcs.createStockInfoFromHoldings(test_submitted_info_array)
    .then(result => {
        expect(result).toStrictEqual(test_stock_info_result_array)
    })
    .catch(err => console.error(err))
    .finally(() => done());
})

test('it gracefully handles one element of submitted portfolio being invalid', async(done) => {
    await capital_and_risk_calcs.createStockInfoFromHoldings(test_submitted_info_array_with_invalid_ticker)
    .then(result => {
        expect(result).toStrictEqual(test_stock_info_result_array_handling_errors)
    })
    .catch(err => console.error(err))
    .finally(() => done());
})

// Test create portfolio
test('enriches a portfolio with capital, capital_share and risk_share', () => {
    expect(capital_and_risk_calcs.createPortfolio(test_stock_info_array_unportfoliod)).toStrictEqual(test_stock_info_array_portfoliod)
})

test('it enriches a portfolio and gracefully handles an invalid ticker', () => {
    expect(capital_and_risk_calcs.createPortfolio(test_stock_info_array_unportfoliod_with_invalid_input)).toStrictEqual(test_stock_info_array_portfoliod_with_invalid_input)
})