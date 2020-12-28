const retrieve_stock_info = require('./retrieve_stock_info')

interface singleStockInfo {
    ticker: string;
    last_price_dollars?: number;
    opt_imp_vol_180d_pct?: number;
    shares_owned?: number;
    capital_invested?: number;
    capital_share?: number;
    one_sigma_risk?: number;
    risk_share?: number;
}

interface submittedStockInfo {
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
    
                return resolve(holding_info);
            }
        })
        .catch(err => reject(console.error(err)))
    })
}

function createStockInfoForHoldings(submitted_holdings: Array<submittedHolding>): Array<Promise<singleStockInfo>> {    
    return submitted_holdings.map(submitted_holding => new Promise((resolve, reject) => {
        console.log("submitted_holding: %o", submitted_holding)
        
        return capital_and_risk_calcs.createSingleStockInfo(submitted_holding)
        .then(result => {
            console.log("result: %o", result)
            return resolve(result)
        })
        .catch(error => {
            console.log("error: %o", error)
            return reject(error)
        })
    }))
}

// async function createPortfolio(submitted_holding: Array<submittedHolding>): Array<singleStockInfo> {
//     let holdings_with_market_data = await submitted_holding.map(holding => {
//         return capital_and_risk_calcs.createSingleStockInfo(holding)
//     })
    
//     return holdings_with_market_data.map(holding => {
        
//         let capital_invested = capital_and_risk_calcs.capitalInvested(holding.last_price_dollars, holding.shares_owned)
//         holding.capital_invested = capital_invested
        
//         let capital_share = capital_and_risk_calcs.capitalShare(holding.ticker, holdings_with_market_data);
//         holding.capital_share = capital_share;

//         let one_sigma_risk = capital_and_risk_calcs.oneSigmaRiskDollars(holding);
//         holding.one_sigma_risk = one_sigma_risk;

//         let risk_share = capital_and_risk_calcs.riskShare(holding.ticker, holdings_with_market_data);
//         holding.risk_share = risk_share;

//         return holding
//     })
// }

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
    createStockInfoForHoldings: createStockInfoForHoldings,
    //createPortfolio: createPortfolio,
    capitalTotal: capitalTotal,
    capitalShare: capitalShare,
    oneSigmaRiskDollars: oneSigmaRiskDollars,
    riskTotal: riskTotal,
    riskShare: riskShare
};

module.exports = capital_and_risk_calcs;