/**
 * @jest-environment node
 */

const { TestScheduler } = require('jest')
const capital_and_risk_calcs = require('../../utils/capital_and_risk_calcs')

const test_submitted_info_single = {
    ticker: 'tsla',
    shares_owned: 10
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

const test_stock_info_array = [
    {
        capital_invested: 6636.900000000001,
        enriched: true,
        last_price_dollars: 663.69,
        opt_imp_vol_180d_pct: 0.6549,
        shares_owned: 10,
        ticker: "tsla"
    },
    {
        capital_invested: 2770,
        enriched: true,
        last_price_dollars: 277,
        opt_imp_vol_180d_pct: 0.3658,
        shares_owned: 10,
        ticker: "fb"
    }
]

const test_portfolio_unriched = [
    {
        ticker: 'tsla',
        last_price_dollars: 10.0,
        opt_imp_vol_180d_pct: 0.5,
        shares_owned: 5.0,
        capital_invested: 50.0
    },
    {
        ticker: 'fb',
        last_price_dollars: 50.0,
        opt_imp_vol_180d_pct: 0.25,
        shares_owned: 3.0,
        capital_invested: 150.0
    }
]

const test_portfolio_enriched = [
    {
        ticker: 'tsla',
        last_price_dollars: 10.0,
        opt_imp_vol_180d_pct: 0.5,
        shares_owned: 5.0,
        capital_invested: 50.0,
        capital_share: 0.25,
        risk_share: 0.40,
        one_sigma_risk: 25
    },
    {
        ticker: 'fb',
        last_price_dollars: 50.0,
        opt_imp_vol_180d_pct: 0.25,
        shares_owned: 3.0,
        capital_invested: 150.0,
        capital_share: 0.75,
        risk_share: 0.60,
        one_sigma_risk: 37.5
    }
]

const tsla_stock_info = {
    ticker: 'tsla',
    last_price_dollars: 663.69,
    opt_imp_vol_180d_pct: 0.6549,
    shares_owned: 10,
    capital_invested: 6636.900000000001,
    enriched: true
}

// Test capitalInvested
test('It calculates 10 shares at $10.00 to be $100.00', () => {
    expect(capital_and_risk_calcs.capitalInvested(10, 10.0)).toBe(100.0)
})

test('It handles partial shares: calculates 10.5 shares at $10.00 to be $105.0', () => {
    expect(capital_and_risk_calcs.capitalInvested(10.5, 10.0)).toBe(105.0)
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
    ).toStrictEqual(test_stock_info_array)
})

// Test create portfolio
test('enriches a portfolio with capital, capital_share and risk_share', () => {
    expect(capital_and_risk_calcs.createPortfolio(test_portfolio_unriched)).toStrictEqual(test_portfolio_enriched)
})

// Test capitalTotal
test('calculates total capital in portfolio', () => {
    expect(capital_and_risk_calcs.capitalTotal(test_portfolio_unriched)).toBe(200.0)
})

// Test capitalShare
test("calculates one stock's share of capital in portfolio", () => {
    expect(capital_and_risk_calcs.capitalShare('tsla', test_portfolio_unriched)).toBe(0.25)
})

// Test oneSigmaRiskDollars
test('calculates dollar value of one sigma move in a stock', () => {
    expect(capital_and_risk_calcs.oneSigmaRiskDollars(test_portfolio_unriched[0])).toBe(25.0)
})

// Test riskTotal
test('calculates total risk across portfolio', () => {
    expect(capital_and_risk_calcs.riskTotal(test_portfolio_unriched)).toBe(62.5)
})

// Test riskShare
test("calculates one stock's share of risk in portfolio", () => {
    expect(capital_and_risk_calcs.riskShare('tsla', test_portfolio_unriched)).toBe(0.4)
})