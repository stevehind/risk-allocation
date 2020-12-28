var retrieve_stock_info = require('./retrieve_stock_info');
function capitalInvested(share_price, number_of_shares) {
    return share_price * number_of_shares;
}
function createSingleStockInfo(submitted_holding) {
    return new Promise(function (resolve, reject) {
        return retrieve_stock_info.retrieveStockInfo(submitted_holding.ticker)
            .then(function (response) {
            console.log("stock_info_repsonse: %o", response);
            if (response.success) {
                var holding_info = response.data;
                var capital_invested = capital_and_risk_calcs.capitalInvested(holding_info.last_price_dollars, submitted_holding.shares_owned);
                holding_info.shares_owned = submitted_holding.shares_owned;
                holding_info.capital_invested = capital_invested;
                console.log("holding_info: %o", holding_info);
                return resolve(holding_info);
            }
        })["catch"](function (err) { return reject(console.error(err)); });
    });
}
function createStockInfoForHoldings(submitted_holdings) {
    return submitted_holdings.map(function (submitted_holding) { return new Promise(function (resolve, reject) {
        console.log("submitted_holding: %o", submitted_holding);
        return capital_and_risk_calcs.createSingleStockInfo(submitted_holding)
            .then(function (result) {
            console.log("result: %o", result);
            return resolve(result);
        })["catch"](function (error) {
            console.log("error: %o", error);
            return reject(error);
        });
    }); });
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
function capitalTotal(portfolio) {
    return portfolio.reduce(function (r, d) { return r + d.capital_invested; }, 0);
}
function capitalShare(ticker, portfolio) {
    var capital = capital_and_risk_calcs.capitalTotal(portfolio);
    var target_stock = portfolio.filter(function (stock) { return stock.ticker === ticker; });
    var target_capital = target_stock[0].capital_invested;
    return target_capital / capital;
}
function oneSigmaRiskDollars(stock) {
    return stock.opt_imp_vol_180d_pct * stock.capital_invested;
}
function riskTotal(portfolio) {
    var stock_risks = portfolio.map(function (stock) {
        return capital_and_risk_calcs.oneSigmaRiskDollars(stock);
    });
    return stock_risks.reduce(function (a, b) { return a + b; }, 0);
}
function riskShare(ticker, portfolio) {
    var risk = capital_and_risk_calcs.riskTotal(portfolio);
    var target_stock = portfolio.filter(function (stock) { return stock.ticker === ticker; });
    var target_risk = capital_and_risk_calcs.oneSigmaRiskDollars(target_stock[0]);
    return target_risk / risk;
}
var capital_and_risk_calcs = {
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
