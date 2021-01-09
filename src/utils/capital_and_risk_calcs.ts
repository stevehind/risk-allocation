import retrieve_stock_info from './retrieve_stock_info'

export interface singleStockInfo {
    enriched: boolean;
    ticker: string;
    portfolio?: boolean;
    last_price_dollars?: number;
    opt_imp_vol_180d_pct?: number;
    shares_owned?: number;
    capital_invested?: number;
    capital_share?: number;
    one_sigma_risk?: number;
    risk_share?: number;
    error_message?: string;
}

interface stockInfoScrapeSuccessResult {
    success: boolean;
    data: singleStockInfo;
}

interface stockInfoScrapeFailureResult {
    success: boolean;
    data: {
        message: string
    };
}

interface submittedHolding {
    ticker: string;
    shares_owned: number;
}

function capitalInvested(stock_info: singleStockInfo): number {
    if (stock_info.enriched) {
        return stock_info.last_price_dollars * stock_info.shares_owned
    }
    return 0

}

function capitalTotal(portfolio: Array<singleStockInfo>): number {
    let capital_per_holding: Array<number> = portfolio.map(holding => holding.capital_invested)

    let capital_per_holding_less_NaNs: Array<number> = capital_per_holding.filter(value => {
        if (isNaN(value)) {
            return 0
        } else {
            return value
        }
    })
    
    return capital_per_holding_less_NaNs.reduce((r, d) => r + d, 0)
}

function capitalShare(ticker: string, portfolio: Array<singleStockInfo>): number {
    let total_capital = capital_and_risk_calcs.capitalTotal(portfolio);
    // this doesn't handle the edge case where the same stock ticker is provided twice in the array
    
    let holding = portfolio.filter(stock => stock.ticker === ticker)[0];

    if ((holding.enriched) && (holding.capital_invested != 0)) {
        let capital_invested = holding.capital_invested;
        return capital_invested / total_capital
    } else {
        return 0
    }
}

function oneSigmaRiskDollars(stock: singleStockInfo): number {
    if (stock.enriched) {
        return stock.opt_imp_vol_180d_pct * Math.abs(stock.capital_invested)
    } else {
        return 0
    }
}

function riskTotal(portfolio: Array<singleStockInfo>): number {
    let stock_risks = portfolio.map(stock => {
        return capital_and_risk_calcs.oneSigmaRiskDollars(stock)
    })

    return stock_risks.reduce((a, b) => a + Math.abs(b), 0);
}

function riskShare(ticker: string, portfolio: Array<singleStockInfo>): number {
    let total_risk = capital_and_risk_calcs.riskTotal(portfolio);

    let holding = portfolio.filter(stock => stock.ticker === ticker);

    let holding_risk = capital_and_risk_calcs.oneSigmaRiskDollars(holding[0])

    return holding_risk / total_risk
}

function createSingleStockInfo(submitted_holding: submittedHolding): Promise<singleStockInfo> {
    return new Promise((resolve, reject) => {
        return retrieve_stock_info.retrieveStockInfo(submitted_holding.ticker)
        .then((response: stockInfoScrapeSuccessResult | stockInfoScrapeFailureResult) => {
            if (response.success) {
                // @ts-ignore
                let enriched_holding: singleStockInfo = response.data
                enriched_holding.enriched = true;
                enriched_holding.portfolio = false;
                enriched_holding.shares_owned = submitted_holding.shares_owned;
                enriched_holding.capital_invested = capital_and_risk_calcs.capitalInvested(enriched_holding)
                enriched_holding.one_sigma_risk = capital_and_risk_calcs.oneSigmaRiskDollars(enriched_holding)
                return resolve(enriched_holding)
            } else {
                // @ts-ignore
                let unenriched_holding: singleStockInfo = response.data;
                unenriched_holding.ticker = submitted_holding.ticker;
                unenriched_holding.enriched = false;
                unenriched_holding.error_message = unenriched_holding.error_message
                return resolve(unenriched_holding)
            }
        })
        .catch(err => console.error(err))
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
        if (stock.enriched) {
            let capital_share = capital_and_risk_calcs.capitalShare(stock.ticker, stock_array);
            stock.capital_share = capital_share
    
            let one_sigma_risk = capital_and_risk_calcs.oneSigmaRiskDollars(stock)
            stock.one_sigma_risk = one_sigma_risk
    
            let risk_share = capital_and_risk_calcs.riskShare(stock.ticker, stock_array)
            stock.risk_share = risk_share
    
            stock.portfolio = true
    
            return stock
        } else {
            return stock
        }

    })
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

export default capital_and_risk_calcs;