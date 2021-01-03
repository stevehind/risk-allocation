"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var HOST = process.env.PUBLIC_URL;
var retrieveStockInfoFromServer = function (submission) {
    return axios_1["default"]({
        method: "POST",
        url: HOST + "submit_single_holding",
        headers: {
            "Content-type": "application/json"
        },
        data: submission
    })
        .then(function (res) {
        if (res.status === 200) {
            return res.data;
        }
        else {
            console.error(res);
        }
    })["catch"](function (err) { return console.error(err); });
};
var api = {
    retrieveStockInfoFromServer: retrieveStockInfoFromServer
};
exports["default"] = api;
