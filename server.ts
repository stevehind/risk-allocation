import { textChangeRangeIsUnchanged } from "typescript"

const express = require('express')
const app = express()
const port = process.env.port || 5000
const cors = require('cors')
const path = require('path')

// Import utils
import cap_risk_calcs from './src/utils/capital_and_risk_calcs'

// Bodyparser middleware
const bodyParser = require('body-parser');
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

app.use(cors());

interface submittedHolding {
    ticker: string;
    shares_owned: number;
}

interface singleStockInfo {
    enriched: boolean;
    portfolio: boolean;
    ticker: string;
    last_price_dollars?: number;
    opt_imp_vol_180d_pct?: number;
    shares_owned?: number;
    capital_invested?: number;
    capital_share?: number;
    one_sigma_risk?: number;
    risk_share?: number;
    error_message?: string;
}

// server the public index.html from the build folder
app.use(express.static(path.join(__dirname, "./", "build")));
app.use(express.static("public"));

app.get('/submit_holdings', (req, res) => {
    return res.status(200).json({ messsage: 'POST to this route only.' })
})

app.post('/submit_holdings', async(req, res) => {
    let submitted_holdings: Array<submittedHolding> = req.body.holdings
    console.log(submitted_holdings);

    return cap_risk_calcs.createStockInfoFromHoldings(submitted_holdings)
    .then(enriched_holdings => {
        return cap_risk_calcs.createPortfolio(enriched_holdings)
    })
    .then(portfolio => {
        console.log("Portfolio: %o", portfolio)
        return res.status(200).json(portfolio)
    })
})

app.post('/submit_single_holding', async(req, res) => {
    let submitted_single_holding: submittedHolding = req.body

    return cap_risk_calcs.createSingleStockInfo(submitted_single_holding)
    .then(stock_info => { return res.status(200).json(stock_info) })
    .catch(err => console.error(err))
})

// Run the server
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})