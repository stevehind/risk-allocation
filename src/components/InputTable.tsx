import * as React from 'react';
import InputTableRow from './InputTableRow'

type Props = any;
type State = {
    submitted_holdings: Array<any>,
    disabled: boolean,
    holding_submitted: boolean,
    row_counter: number,
    row_keys: Array<number>,
    rows_to_delete: Array<number>
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
            row_keys: [1],
            rows_to_delete: []
        }

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
        let new_counter = this.state.row_counter + 1
        
        this.setState({
            row_counter: new_counter
        })
    }

    determineRowstoDelete = (supplied_props: suppliedProps) => {
        let index = supplied_props.index
        let rows_to_delete = this.state.rows_to_delete
        rows_to_delete.push(index)
        
        this.setState({
            rows_to_delete: rows_to_delete
        })
    }

    deleteSelectedRows = (data) => {
        console.log(data);
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
                        <tr>
                            <td>TSLA</td>
                            <td>10</td>
                            <td>600</td>
                            <td>6.0</td>
                            <td>100%</td>
                            <td>65%</td>
                            <td>3.9</td>
                            <td>100%</td>
                            <td>...</td>
                        </tr>
                        {
                            //[...Array(this.state.row_counter)]
                            this.state.row_keys.map(
                                (row_key: number) => {
                                    return <InputTableRow index={row_key} onChange={this.determineRowstoDelete} />
                                }
                            )
                        }
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <button
                                    onClick={this.deleteSelectedRows}
                                >
                                    Delete selected
                                </button>
                            </td>
                        </tr>
                    </tbody>
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