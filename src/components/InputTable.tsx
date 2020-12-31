import * as React from 'react';
import InputTableRow from './InputTableRow'

type Props = any;
type State = {
    submitted_holdings: Array<any>,
    disabled: boolean,
    holding_submitted: boolean,
    row_counter: number
}

class InputTable extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            submitted_holdings: [],
            disabled: true,
            holding_submitted: false,
            row_counter: 1
        }

    }

    incrementRowCounter = () => {
        let new_counter = this.state.row_counter + 1
        
        this.setState({
            row_counter: new_counter
        })
    }

    renderRows = (event: React.SyntheticEvent) => {
        this.incrementRowCounter();

        for(var i = 0; i < this.state.row_counter; i++ ) {
            return <InputTableRow/>           
        }
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
                            <th>Capital invested ($k)</th>
                            <th>Share of capital</th>
                            <th>Options-implied volatility (one sigma)</th>
                            <th>One sigma risk ($k)</th>
                            <th>Share of risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>TSLA</td>
                            <td>10</td>
                            <td></td>
                            <td>600</td>
                            <td>6.0</td>
                            <td>100%</td>
                            <td>65%</td>
                            <td>3.9</td>
                            <td>100%</td>
                        </tr>
                        {
                            [...Array(this.state.row_counter)].map(
                                (value: undefined, index: number) => {
                                    return <InputTableRow/>
                                }
                            )
                        }
                    </tbody>
                </table>
                <button
                    onClick={this.renderRows}
                >
                    Add another row
                </button>
            </div>
        )
    }
}

export default InputTable