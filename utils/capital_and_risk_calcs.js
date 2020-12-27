var retrieve_stock_info = require('./retrieve_stock_info');
function capitalInvested(share_price, number_of_shares) {
    return share_price * number_of_shares;
}
function createSingleStockInfo(ticker, shares_owned) {
    return retrieve_stock_info.retrieveStockInfo(ticker)
        .then(function (response) {
        if (response.success) {
            var data = response.data;
            var capital_invested = capitalInvested(data.last_price_dollars, shares_owned);
            data.shares_owned = shares_owned;
            data.capital_invested = capital_invested;
            return data;
        }
    })["catch"](function (err) { return console.error(err); });
}
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
    capitalTotal: capitalTotal,
    capitalShare: capitalShare,
    oneSigmaRiskDollars: oneSigmaRiskDollars,
    riskTotal: riskTotal,
    riskShare: riskShare
};
module.exports = capital_and_risk_calcs;
