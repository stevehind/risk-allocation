import * as React from 'react';
import InputTableRow from './InputTableRow'

type Props = any;
type State = {
    submitted_holdings: Array<any>,
    disabled: boolean,
    holding_submitted: boolean,
    row_counter: number,
    row_keys: Array<number>
}

type suppliedProps = {
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
            row_keys: [1]
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


    deleteSelectedRows = (supplied_props: suppliedProps): void => {
        let new_row_keys = this.state.row_keys.filter(row => row != supplied_props.index)

        this.setState({
            row_keys: new_row_keys
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
                            <th>Last closing price ($)</th>
                            <th>Capital invested ($k)</th>
                            <th>Share of capital</th>
                            <th>Options-implied volatility (one sigma)</th>
                            <th>One sigma risk ($k)</th>
                            <th>Share of risk</th>
                            <th>Delete?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.row_keys.map(
                                (row_key: number) => {
                                    return <InputTableRow index={row_key} onChange={this.deleteSelectedRows} />
                                }
                            )
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                --capital sum--
                            </td>
                            <td>
                                100%
                            </td>
                            <td>
                                ...
                            </td>
                            <td>
                                --risk sum--
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