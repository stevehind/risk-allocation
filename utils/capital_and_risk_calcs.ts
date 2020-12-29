const retrieve_stock_info = require('./retrieve_stock_info')

interface singleStockInfo {
    enriched: boolean;
    portfolio: boolean;
    ticker: string;
    last_price_dollars?: number;
    opt_imp_vol_180d_pct?: number;
    shares_owned?: number;
    capital_invested?: number;
    capital_share?: number;
    one_sigma_risk?: number;
    risk_share?: number;
    error_message?: string;
}

interface submittedHolding {
    ticker: string;
    shares_owned: number;
}

function capitalInvested(share_price: number, number_of_shares: number): number {
    return share_price * number_of_shares
}

function createSingleStockInfo(submitted_holding: submittedHolding): Promise<singleStockInfo> {
    return new Promise((resolve, reject) => {
        return retrieve_stock_info.retrieveStockInfo(submitted_holding.ticker)
        .then(response => {

            if (response.success) {
                let holding_info = response.data

                let capital_invested = capital_and_risk_calcs.capitalInvested(holding_info.last_price_dollars, submitted_holding.shares_owned )
    
                holding_info.shares_owned = submitted_holding.shares_owned;
                holding_info.capital_invested = capital_invested;
                holding_info.enriched = true;
                holding_info.portfolio = false;
                
                return resolve(holding_info);
            }
        })
        .catch(err => reject({
            enriched: false,
            error_message: err
        }))
    })
}

async function createStockInfoFromHoldings(submitted_holdings: Array<submittedHolding>): Promise<Array<singleStockInfo>> {
    return Promise.all(
        submitted_holdings.map(submitted_holding => {
            return createSingleStockInfo(submitted_holding)
            .then(result => {
                return result
            })
            .catch(error => error)
        })
    )
}

function createPortfolio(stock_array: Array<singleStockInfo>): Array<singleStockInfo> {
    return stock_array.map(stock => {
        let capital_share = capital_and_risk_calcs.capitalShare(stock.ticker, stock_array);
        stock.capital_share = capital_share

        let one_sigma_risk = capital_and_risk_calcs.oneSigmaRiskDollars(stock)
        stock.one_sigma_risk = one_sigma_risk

        let risk_share = capital_and_risk_calcs.riskShare(stock.ticker, stock_array)
        stock.risk_share = risk_share

        stock.portfolio = true

        return stock
    })
}

function capitalTotal(portfolio: Array<singleStockInfo>): number {
    return portfolio.reduce((r, d) => r + d.capital_invested, 0)
}

function capitalShare(ticker: string, portfolio: Array<singleStockInfo>) {
    let capital = capital_and_risk_calcs.capitalTotal(portfolio);

    let target_stock = portfolio.filter(stock => stock.ticker === ticker);

    let target_capital = target_stock[0].capital_invested;

    return target_capital / capital;
}

function oneSigmaRiskDollars(stock: singleStockInfo) {
    return stock.opt_imp_vol_180d_pct * stock.capital_invested
}

function riskTotal(portfolio: Array<singleStockInfo>) {
    let stock_risks = portfolio.map(stock => {
        return capital_and_risk_calcs.oneSigmaRiskDollars(stock)
    })

    return stock_risks.reduce((a, b) => a + b, 0);
}

function riskShare(ticker: string, portfolio: Array<singleStockInfo>) {
    let risk = capital_and_risk_calcs.riskTotal(portfolio);

    let target_stock = portfolio.filter(stock => stock.ticker === ticker);

    let target_risk = capital_and_risk_calcs.oneSigmaRiskDollars(target_stock[0])

    return target_risk / risk
}

const capital_and_risk_calcs = {
    capitalInvested: capitalInvested,
    createSingleStockInfo: createSingleStockInfo,
    createStockInfoFromHoldings: createStockInfoFromHoldings,
    createPortfolio: createPortfolio,
    capitalTotal: capitalTotal,
    capitalShare: capitalShare,
    oneSigmaRiskDollars: oneSigmaRiskDollars,
    riskTotal: riskTotal,
    riskShare: riskShare
};

module.exports = capital_and_risk_calcs;