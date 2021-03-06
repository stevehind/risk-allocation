import * as React from 'react';
import InputTableRow from './InputTableRow'
import cap_risk_calcs from '../utils/capital_and_risk_calcs'
import type { singleStockInfo } from '../utils/capital_and_risk_calcs'

type indexedHolding = {
    component_index: number,
    holding: singleStockInfo
}

type Props = any;
type State = {
    submitted_holdings: Array<indexedHolding>,
    disabled: boolean,
    holding_submitted: boolean,
    row_counter: number,
    row_keys: Array<number>,
    capital_total: number,
    risk_total: number
}

type childState = {
    index?: number,
    capital_invested?: number,
    delete?: boolean,
    last_price_dollars?: number,
    one_sigma_risk?: number,
    opt_imp_vol_180d_pct?: number,
    shares_owned?: number,
    submission?: {ticker: string, shares_owned: string}
    submitted?: boolean,
    ticker?: string
}

type suppliedChildProps = {
    index: number,
    onChange: any
}

class InputTable extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            submitted_holdings: [],
            disabled: true,
            holding_submitted: false,
            row_counter: 1,
            row_keys: [1],
            risk_total: 0,
            capital_total: 0
        }

        this.deleteSelectedRows = this.deleteSelectedRows.bind(this)

    }

    makeRowKeys = () => {
        let counter = this.state.row_counter
        let current_keys = this.state.row_keys
        let new_keys = Array(counter)

        if (counter === 1) {
            this.setState({ row_keys: new_keys })
        } else {
            this.setState({ row_keys: current_keys })
        }        
    }

    incrementRowCounter = () => {
        let new_counter: number = this.state.row_counter + 1
        
        this.state.row_keys.push(new_counter)

        this.setState({
            row_counter: new_counter,
            row_keys: this.state.row_keys
        })
    }

    deleteSelectedRows = (supplied_child_props: suppliedChildProps): void => {
        let new_row_keys = this.state.row_keys.filter(row => row != supplied_child_props.index)
        let new_holdings = this.state.submitted_holdings.filter(holding => holding.component_index != supplied_child_props.index)
        new_holdings = this.addPortfolioData(new_holdings)

        this.setState({
            row_keys: new_row_keys,
            submitted_holdings: new_holdings,
        }, () => {
            let stock_array: Array<singleStockInfo> = this.state.submitted_holdings.map(indexed_holding => indexed_holding.holding)
            let capital_total: number = cap_risk_calcs.capitalTotal(stock_array)
            let risk_total: number = cap_risk_calcs.riskTotal(stock_array)

            this.setState({
                capital_total: capital_total,
                risk_total: risk_total
            })
        })
    }

    collectChildState = (child_state: childState) => {

        let stock_info: singleStockInfo = {
            ticker: child_state.ticker,
            last_price_dollars: child_state.last_price_dollars,
            shares_owned: child_state.shares_owned,
            capital_invested: child_state.capital_invested,
            opt_imp_vol_180d_pct: child_state.opt_imp_vol_180d_pct,
            one_sigma_risk: child_state.one_sigma_risk,
            enriched: true,
            portfolio: false
        }

        let existing_submitted_holdings = this.state.submitted_holdings

        let new_or_updated_holding: indexedHolding = {
            component_index: child_state.index,
            holding: stock_info
        }
        let to_add: boolean = false

        existing_submitted_holdings.map((indexed_holding: indexedHolding) => {
            if (indexed_holding.component_index === child_state.index) {
                to_add = true
                indexed_holding.holding = new_or_updated_holding.holding
            }
        })

        if (!to_add) {
            existing_submitted_holdings.push(new_or_updated_holding)
        }

        this.setState({
            submitted_holdings: existing_submitted_holdings
        }, () => {
            let stock_array: Array<singleStockInfo> = this.state.submitted_holdings.map(indexed_holding => indexed_holding.holding)
            let total_capital: number = cap_risk_calcs.capitalTotal(stock_array)
            let total_risk: number = cap_risk_calcs.riskTotal(stock_array)

            this.state.submitted_holdings.map(indexed_holding => {
                indexed_holding.holding.capital_share = indexed_holding.holding.capital_invested / total_capital
                indexed_holding.holding.risk_share = indexed_holding.holding.one_sigma_risk / total_risk
            })

            this.setState({
                risk_total: total_risk,
                capital_total: total_capital
            })
        })
    }

    addPortfolioData = (holdings: Array<indexedHolding>): Array<indexedHolding> => {
        let stock_array: Array<singleStockInfo> = holdings.map(holding => holding.holding)

        let stock_array_enriched = cap_risk_calcs.createPortfolio(stock_array)

        let new_holdings = holdings.map((holding, index) => {
            holding.holding = stock_array_enriched[index]
            return holding
        })
        return new_holdings    
    }

    getStateForChild = (index, holdings: Array<indexedHolding>): indexedHolding => {
        let state_for_this_child = holdings.filter(holding => holding.component_index === index)[0]
        return state_for_this_child
    }

    sumCapital = (holdings: Array<indexedHolding>): void => {
        let stocks = holdings.map(holding => holding.holding)
        this.setState({
            capital_total: cap_risk_calcs.capitalTotal(stocks)
        })
    }

    sumRisk = (holdings: Array<indexedHolding>): void => {
        let stocks = holdings.map(holding => holding.holding)
        this.setState({
            risk_total: cap_risk_calcs.riskTotal(stocks)
        })  
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Stock ticker</th>
                            <th>Number of shares owned</th>
                            <th></th>
                            <th>Last closing price ($)</th>
                            <th>Capital invested ($)</th>
                            <th>Share of capital</th>
                            <th>Options-implied volatility (one sigma)</th>
                            <th>One sigma risk ($)</th>
                            <th>Share of risk</th>
                            <th>Delete?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.row_keys.map(
                                (row_key: number) => {
                                    return <InputTableRow
                                        key={row_key}
                                        index={row_key}
                                        stateFromParent={this.getStateForChild(row_key, this.state.submitted_holdings)}
                                        onChange={this.collectChildState}
                                        onDelete={this.deleteSelectedRows}
                                    />
                                }
                            )
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}><b>Total:</b></td>
                            <td></td>
                            <td>
                                { Math.round(this.state.capital_total).toLocaleString() }
                            </td>
                            <td>
                                100%
                            </td>
                            <td></td>
                            <td>
                            { Math.round(this.state.risk_total).toLocaleString() }
                            </td>
                            <td>
                                100%
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                <button
                    onClick={this.incrementRowCounter}
                >
                    Add another row
                </button>
            </div>
        )
    }
}

export default InputTable