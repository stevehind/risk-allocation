import * as React from 'react';

type Submission = {
    ticker: string,
    shares_owned: number
}

type State = {
    submitted: boolean,
    ticker: string | null,
    shares_owned: number | null,
    submission: Submission | undefined
}

type Props = {

}

class InputTableRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const state: State = this.state = {
            submitted: false,
            ticker: null,
            shares_owned: null,
            submission: undefined
        }
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        this.setState({
            [name]: value
        } as any)

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
            })
        }
    }
   
    render() {
        return (
            <tr>
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
            </tr>
        )
    }
}

export default InputTableRow;