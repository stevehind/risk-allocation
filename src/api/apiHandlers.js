"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var HOST = 'http://localhost:5000/';
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
        console.log("logging api response: %o", res);
        return res;
    })["catch"](function (err) { return console.error(err); });
};
var api = {
    retrieveStockInfoFromServer: retrieveStockInfoFromServer
};
exports["default"] = api;
