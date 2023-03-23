import axios from "axios";


export const marketOrder = {
    Buy: 1,
    Sell: 0,
};


export async function getMatchedCoinNets() {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/matchedcoins/',
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;
    return ret['result'];
};

export async function getbalance_huobi(coin) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/huobi/balance/',
        params: {
            coin: coin,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;
    return ret['result'];
};


export async function getbalance_hitbtc(coin) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/hitbtc/balance/',
        params: {
            coin: coin,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;
    return ret['result'];
};


export async function getCryptoCurrencies_huobi() {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/huobi/currencies/',
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;
    return ret['result'];
};

export async function getCryptoCurrencies_hitbtc() {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/hitbtc/currencies/',
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;
    return ret['result'];
};

export async function is_tradingSymbol(coin1, coin2, exchange) {

    let ret = [];
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/istradingsymbol',
        params: {
            coin1: coin1,
            coin2: coin2,
            exchange: exchange,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;
    return ret['result'];

};

export async function trade_huobi(type, coin, basecoin, amount) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/huobi/trade',
        params: {
            type: type,
            coin: coin,
            basecoin: basecoin,
            amount: amount,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;

    return ret;

}

export async function trade_hitbtc(type, coin, basecoin, amount) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/hitbtc/trade',
        params: {
            type: type,
            coin: coin,
            basecoin: basecoin,
            amount: amount,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;

    return ret;

}

export async function transfer_hitbtc(type, coin, amount) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/hitbtc/transfer',
        params: {
            type: type,
            coin: coin,
            amount: amount,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;

    return ret;

}

export async function convert_hitbtc(coin, net, convertedcoin, convertednet, amount, direction = 0) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/hitbtc/convert',
        params: {
            coin: coin,
            net: net,
            convertedcoin: convertedcoin,
            convertednet: convertednet,
            amount: amount,
            direction: direction,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;

    return ret;

}

export async function withdraw_huobi(coinWithdraw, netWithdraw, coinDeposit, netDeposit, amount) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/huobi/withdraw',
        params: {
            coinWithdraw: coinWithdraw,
            netWithdraw: netWithdraw,
            coinDeposit: coinDeposit,
            netDeposit: netDeposit,
            amount: amount,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;




    return ret;

}

export async function withdraw_hitbtc(coinWithdraw, netWithdraw, coinDeposit, netDeposit, amount) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/hitbtc/withdraw',
        params: {
            coinWithdraw: coinWithdraw,
            netWithdraw: netWithdraw,
            coinDeposit: coinDeposit,
            netDeposit: netDeposit,
            amount: amount,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;

    return ret;

}

export async function checkingWithdraw_huobi(coin, id) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/huobi/checkwithdraw',
        params: {
            coin: coin,
            id: id,
        },

        headers: {}
    };

    const response = await axios(config);
    ret = response.data;

    return ret;

}

export async function checkingWithdraw_hitbtc(coin, id) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/hitbtc/checkwithdraw',
        params: {
            coin: coin,
            id: id,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;

    return ret;

}


export async function getTickData(exchange, symbol) {

    let ret = -1;
    const config = {
        method: 'get',
        url: 'http://localhost:8080/api/tickdata',
        params: {
            exchange: exchange,
            symbol: symbol,
        },
        headers: {}
    };

    const response = await axios(config);
    ret = response.data;

    return ret;

}


















