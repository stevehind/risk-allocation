const express = require('express')
const app = express()
const port = process.env.port || 3000
const path = require('path')

// Import utils
const cap_risk_calcs = require('./utils/capital_and_risk_calcs')

// Bodyparser middleware
const bodyParser = require('body-parser');
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

interface submittedHolding {
    ticker: string,
    shares_owned: number
}

interface singleStockInfo {
    ticker: string;
    last_price_dollars?: number;
    opt_imp_vol_180d_pct?: number;
    shares_owned?: number;
    capital_invested?: number;
    capital_share?: number;
    one_sigma_risk?: number;
    risk_share?: number;
}

// Basic get '/' route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'server running.'})
})

app.post('/submit_holdings', async(req, res) => {
    let holdings_object = req.body

    res.status(200).json({message: 'foobar'})
})

// Run the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})