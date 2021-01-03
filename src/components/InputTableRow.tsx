import * as React from 'react';
import api from '../api/apiHandlers'

type Submission = {
    ticker: string,
    shares_owned: number
}

type State = {
    submitted: boolean,
    ticker: string | undefined,
    shares_owned: number | undefined,
    submission: Submission | undefined,
    delete: boolean,
    capital_invested: number | undefined,
    last_price_dollars: number | undefined,
    opt_imp_vol_180d_pct: number | undefined,
    one_sigma_risk: number | undefined
}

type Props = {
    index: number,
    onChange: any
}

class InputTableRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const state: State = this.state = {
            submitted: false,
            ticker: undefined,
            shares_owned: undefined,
            submission: undefined,
            delete: false,
            capital_invested: undefined,
            last_price_dollars: undefined,
            opt_imp_vol_180d_pct: undefined,
            one_sigma_risk: undefined
        }
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        this.setState({
            [name]: value
        } as any, () => {
            let submission = {
                ticker: this.state.ticker,
                shares_owned: this.state.shares_owned
            }      
            
            this.setState({
                submission: submission
            } as any, () => {
                if (this.state.submission.ticker && this.state.submission.shares_owned) {
                    console.log("logging submission: %o", submission)

                    this.setState({
                        submitted: true
                    } as any, async() => {
                        return await api.retrieveStockInfoFromServer(this.state.submission)
                        .then(res => {
                            if (res.status === 200) {
                                this.setState({
                                    capital_invested: res.data.capital_invested,
                                    last_price_dollars: res.data.last_price_dollars,
                                    opt_imp_vol_180d_pct: res.data.opt_imp_vol_180d_pct,
                                    one_sigma_risk: res.data.one_sigma_risk 
                                })
                            }
                        })
                        .catch(err => console.log(err))
                        
                    })
                }
            })
        })



    }

    handleDelete = (event: React.SyntheticEvent) => {
        if (this.state.delete) {
            this.setState({ delete: false }, () => {
                if (this.props.onChange) {
                    this.props.onChange(this.props)
                }
            })
        } else {
            this.setState({ delete: true }, () => {
                if (this.props.onChange) {
                    this.props.onChange(this.props)
                }
            })
        }
    }
   
    render() {
        return (
            <tr key={this.props.index}>
                <td>
                    <input
                        type="text"
                        name="ticker"
                        placeholder="Stock ticker"
                        onChange={this.handleChange}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        name="shares_owned"
                        placeholder="Shares owned"
                        onChange={this.handleChange}
                    />
                </td>
                <td>{ this.state.last_price_dollars ? this.state.last_price_dollars : "..." }</td>
                <td>{ this.state.capital_invested ? this.state.capital_invested : "..." }</td>
                <td>...</td>
                <td>{ this.state.opt_imp_vol_180d_pct ? this.state.opt_imp_vol_180d_pct : "..." }</td>
                <td>{ this.state.one_sigma_risk ? this.state.one_sigma_risk : "..." }</td>
                <td>...</td>
                <td>
                    <button 
                        onClick={this.handleDelete.bind(this)}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        )
    }
}

export default InputTableRow;