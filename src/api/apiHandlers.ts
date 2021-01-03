import axios from 'axios'

const HOST: string = process.env.PUBLIC_URL;

type submission = {
    ticker: string,
    shares_owned: number
}

type singleStockInfo = any

const retrieveStockInfoFromServer = (submission: submission): singleStockInfo => {
    return axios({
        method: "POST",
        url: `${HOST}submit_single_holding`,
        headers: {
            "Content-type": "application/json"
        },
        data: submission
    })
    .then(res => {
        if (res.status === 200) {
            return res.data
        } else {
            console.error(res)
        }
        
    })
    .catch(err => console.error(err))
}

const api = {
    retrieveStockInfoFromServer: retrieveStockInfoFromServer
}

export default api