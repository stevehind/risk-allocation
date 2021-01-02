import * as React from 'react';
const c_and_r_calcs = require('../utils/capital_and_risk_calcs')

type Submission = {
    ticker: string,
    shares_owned: number
}

type State = {
    submitted: boolean,
    ticker: string | null,
    shares_owned: number | null,
    submission: Submission | undefined,
    delete: boolean
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
            ticker: null,
            shares_owned: null,
            submission: undefined,
            delete: false
        }
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        this.setState({
            [name]: value
        } as any)
    }

    handleCheckbox = (event: React.SyntheticEvent) => {
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

    submit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if(this.state.ticker && this.state.shares_owned) {
            this.setState({
                submitted: true,
                submission: {
                   ticker: this.state.ticker,
                   shares_owned: this.state.shares_owned 
                }
            }, () => {
                console.log(
                    c_and_r_calcs.createSingleStockInfo(this.state.submission)
                    .then(result => result)
                    .catch(error => error)
                )
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
                <td>
                    <button
                        onClick={this.submit}
                    >
                        Get data...
                    </button>
                </td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>
                    <input
                        type="checkbox"
                        name="delete"
                        defaultChecked={false}
                        onChange={this.handleCheckbox}
                    />
                </td>
            </tr>
        )
    }
}

export default InputTableRow;