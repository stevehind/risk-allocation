"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var retrieve_stock_info_1 = require("./retrieve_stock_info");
function capitalInvested(stock_info) {
    if (stock_info.enriched) {
        return stock_info.last_price_dollars * stock_info.shares_owned;
    }
    return 0;
}
function capitalTotal(portfolio) {
    var capital_per_holding = portfolio.map(function (holding) {
        return holding.capital_invested;
    });
    var capital_per_holding_less_NaNs = capital_per_holding.filter(function (value) {
        if (isNaN(value)) {
            return 0;
        }
        else {
            return value;
        }
    });
    return capital_per_holding_less_NaNs.reduce(function (r, d) { return r + d; }, 0);
}
function capitalShare(ticker, portfolio) {
    var total_capital = capital_and_risk_calcs.capitalTotal(portfolio);
    // this doesn't handle the edge case where the same stock ticker is provided twice in the array
    var holding = portfolio.filter(function (stock) { return stock.ticker === ticker; })[0];
    if ((holding.enriched) && (holding.capital_invested != 0)) {
        var capital_invested = holding.capital_invested;
        return capital_invested / total_capital;
    }
    else {
        return 0;
    }
}
function oneSigmaRiskDollars(stock) {
    if (stock.enriched) {
        return stock.opt_imp_vol_180d_pct * stock.capital_invested;
    }
    else {
        return 0;
    }
}
function riskTotal(portfolio) {
    var stock_risks = portfolio.map(function (stock) {
        return capital_and_risk_calcs.oneSigmaRiskDollars(stock);
    });
    return stock_risks.reduce(function (a, b) { return a + b; }, 0);
}
function riskShare(ticker, portfolio) {
    var total_risk = capital_and_risk_calcs.riskTotal(portfolio);
    var holding = portfolio.filter(function (stock) { return stock.ticker === ticker; });
    var holding_risk = capital_and_risk_calcs.oneSigmaRiskDollars(holding[0]);
    return holding_risk / total_risk;
}
function createSingleStockInfo(submitted_holding) {
    return new Promise(function (resolve, reject) {
        return retrieve_stock_info_1["default"].retrieveStockInfo(submitted_holding.ticker)
            .then(function (response) {
            if (response.success) {
                // @ts-ignore
                var enriched_holding = response.data;
                enriched_holding.enriched = true;
                enriched_holding.portfolio = false;
                enriched_holding.shares_owned = submitted_holding.shares_owned;
                enriched_holding.capital_invested = capital_and_risk_calcs.capitalInvested(enriched_holding);
                enriched_holding.one_sigma_risk = capital_and_risk_calcs.oneSigmaRiskDollars(enriched_holding);
                return resolve(enriched_holding);
            }
            else {
                // @ts-ignore
                var unenriched_holding = response.data;
                unenriched_holding.ticker = submitted_holding.ticker;
                unenriched_holding.enriched = false;
                return resolve(unenriched_holding);
            }
        })["catch"](function (err) { return console.error(err); });
    });
}
function createStockInfoFromHoldings(submitted_holdings) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.all(submitted_holdings.map(function (submitted_holding) {
                    return createSingleStockInfo(submitted_holding)
                        .then(function (result) {
                        return result;
                    })["catch"](function (error) { return error; });
                }))];
        });
    });
}
function createPortfolio(stock_array) {
    return stock_array.map(function (stock) {
        if (stock.enriched) {
            var capital_share = capital_and_risk_calcs.capitalShare(stock.ticker, stock_array);
            stock.capital_share = capital_share;
            var one_sigma_risk = capital_and_risk_calcs.oneSigmaRiskDollars(stock);
            stock.one_sigma_risk = one_sigma_risk;
            var risk_share = capital_and_risk_calcs.riskShare(stock.ticker, stock_array);
            stock.risk_share = risk_share;
            stock.portfolio = true;
            return stock;
        }
        else {
            return stock;
        }
    });
}
var capital_and_risk_calcs = {
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
exports["default"] = capital_and_risk_calcs;
