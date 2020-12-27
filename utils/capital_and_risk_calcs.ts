const retrieve_stock_info = require('./retrieve_stock_info')

interface singleStockInfo {
    ticker: string;
    last_price_dollars: number;
    opt_imp_vol_180d_pct: number;
    shares_owned: number;
    capital_invested?: number;
    capital_share?: number;
    one_sigma_risk?: number;
    risk_share?: number;
}

function capitalInvested(share_price: number, number_of_shares: number): number {
    return share_price * number_of_shares
}

function createSingleStockInfo(ticker: string, shares_owned: number): singleStockInfo {
    return retrieve_stock_info.retrieveStockInfo(ticker)
    .then(response => {

        if (response.success) {
            let data = response.data
            let capital_invested = capitalInvested(data.last_price_dollars, shares_owned )

            data.shares_owned = shares_owned;
            data.capital_invested = capital_invested;

            return data;
        }
    })
    .catch(err => console.error(err))
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
    capitalTotal: capitalTotal,
    capitalShare: capitalShare,
    oneSigmaRiskDollars: oneSigmaRiskDollars,
    riskTotal: riskTotal,
    riskShare: riskShare
};

module.exports = capital_and_risk_calcs;