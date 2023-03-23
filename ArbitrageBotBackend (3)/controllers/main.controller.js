const ccxt = require('ccxt');
const e = require('express');
const config = require('../config/key.config');
const fromExponential = require('from-exponential')

const ECase = {
    ehuobi_trade: 'ehuobi_trade',
    ehuobi_withdraw: 'ehuobi_withdraw',
    ehitbtc_trade: 'ehitbtc_trade',
    ehitbtc_convert: 'ehitbtc_convert',
    ehitbtc_transferWS: 'ehitbtc_transferWS',
    ehitbtc_transferSW: 'ehitbtc_transferSW',
    ehitbtc_withdraw: 'ehitbtc_withdraw',
}

const countDecimals = function (val) {
    const value = fromExponential(val);
    if (value.split(".")[1] === undefined)
        return 0
    else
        return value.split(".")[1].length || 0;
}


function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}


class ExchangeTrade {

    constructor() {

        this.huobipro = new ccxt.huobipro({
            apiKey: config.huobi_apiKey,
            secret: config.huobi_secret,
        });

        this.hitbtcpro = new ccxt.hitbtc3({
            apiKey: config.hitbtc_apiKey,
            secret: config.hitbtc_secret,
        });

        this.kraken = new ccxt.kraken({

            apiKey: config.kraken_apiKey,
            secret: config.kraken_secret,
        });
        this.kucoin = new ccxt.kucoin({
            'apiKey': config.kucoin_apiKey,
            'secret': config.kucoin_secret,
            'password' : "Universal2023!",
            'enableRateLimit': true,
            'trust': true // enable trust option
        });
        this.bitfinex = new ccxt.bitfinex({
        
            apiKey: config.bitfinex_apiKey,
            secret: config.bitfinex_secret,
        });
        this.binance = new ccxt.binance({
        
            apiKey: config.binance_apiKey,
            secret: config.binance_secret,
        });
        this.exmo = new ccxt.exmo({
        
            apiKey: config.exmo_apiKey,
            secret: config.exmo_secret,
        });
        this.coinbasepro = new ccxt.coinbasepro({
        
            apiKey: config.coinbase_apiKey,
            secret: config.coinbase_secret,
        });

        this.initialize();
    }

    async initialize() {

        
        this.difference = 1e-6;
        this.timeOut = 3600; // second
    }

    async test() {
        let aa = await this.huobipro.createOrder("USDD/USDT", 'market', 'buy', 1);
        console.log(aa)

    }


    getRet(res, message) {

        let txt = { 'result': res, 'message': message };
        return txt;
    }

    async getMatchedCoinNets() {

        let coinMap = new Map();
        let huobi_markets = await this.huobipro.fetchMarkets();
        let hitbtc_markets = await this.hitbtcpro.fetchMarkets();
        for (let i = 0; i < hitbtc_markets.length; i++) {
            let hitbtc_market = hitbtc_markets[i];
            for (let j = 0; j < huobi_markets.length; j++) {
                let huobi_market = huobi_markets[j];

                let base = hitbtc_market.base.toLowerCase() === huobi_market.base.toLowerCase();
                let spot = hitbtc_market.spot === true && huobi_market.spot === true;

                // let usdt = hitbtc_market.quote.toLowerCase() === 'USDT'.toLowerCase() && huobi_market.quote.toLowerCase() === 'USDT'.toLowerCase();
                let active = hitbtc_market.active === true && huobi_market.active === true;

                if (base && spot && /*usdt &&*/ active) {

                    let hit_nets = this.getNetworks(hitbtc_market.base, this.hitbtc_currencies);
                    let huo_nets = this.getNetworks(huobi_market.base, this.huobi_currencies);

                    let coinfind = false;
                    for (const hit_net in hit_nets) {
                        let val1 = hit_nets[hit_net];
                        for (const huo_net in huo_nets) {
                            let val2 = huo_nets[huo_net];
                            if (val1 === val2) {
                                coinMap.set(hitbtc_market.base, val1);
                                coinfind = true;
                                break;
                            }
                        }

                        if (coinfind)
                            break;
                    }

                }
            }

        }

        return coinMap;
    }

    getNetworks(baseSym, currencies) {
        let base = baseSym.toUpperCase();
        let obj = currencies;
        let net = [];
        if (obj[base] == undefined)
            return net;

        let obj2 = obj[base].networks;
        if (obj2.deposit === false)
            return net;

        let key2 = Object.keys(obj2);
        for (let name2 in key2) {
            let value2 = key2[name2];
            net.push(obj2[value2].network);
        }

        return net;
    }

    async getCryptoCurrencies_hitbtc() {

        let message = "hitbtc crypto currencies";
        let res = [];
        let currencies = this.hitbtc_currencies;
        Object.keys(currencies).forEach(function (key) {
            if (currencies[key].info.crypto === true && currencies[key].active === true &&
                currencies[key].withdraw === true && currencies[key].deposit === true) {
                res.push(currencies[key]);
            }
        });


        return this.getRet(res, message);
    }

    async getCryptoCurrencies_huobi() {

        let message = "huobi crypto currencies";
        let res = [];
        let currencies = this.huobi_currencies;
        Object.keys(currencies).forEach(function (key) {

            if (currencies[key].active === true && currencies[key].deposit === true && currencies[key].withdraw === true) {
                // if (key == 'USDD'){
                //     console.log(currencies[key].active)
                //     console.log(currencies[key].deposit)
                //     console.log(currencies[key].withdraw)

                // }

                res.push(currencies[key]);
            }
        });


        return this.getRet(res, message);
    }

    async is_tradingSymbol(coin1, coin2, ex) {
        let symbol = coin1 + '/' + coin2;
        let ticker;
        let message = "trading symbol";
        let res = true;

        if (ex == 0) {
            try {
                ticker = await this.huobipro.fetchTickers([symbol]);
            }
            catch (error) {
                ticker = undefined;
                message = error.message;

            }

        }
        else {
            try {

                ticker = await this.hitbtcpro.fetchTickers([symbol]);
                // console.log(ticker);
            }
            catch (error) {
                ticker = undefined;
                message = error.message;

            }

        }


        if (ticker === undefined) {
            res = false;
        }

        return this.getRet(res, message);
    }


    async trade_huobi(type, coin, basecoin, amount) {

        let res = -1;
        let message = 'failed to trade coin in huobi.';

        let sType = type == 1 ? "buy" : "sell";
        console.log(`/// ${sType} coin in huobi.`);

        if (amount == 0) {
            message = `${sType} amount is zero in huobi`;
            return this.getRet(res, message);
        }

        const _coin = basecoin;
        let huobi_balance = await this.huobipro.fetchBalance();
        const checkingAmount = await this.checkAmount(huobi_balance, _coin, amount, ECase.ehuobi_trade);
        if (checkingAmount === false) {
            if (huobi_balance[_coin] === undefined) {
                message = `${sType} amount(${huobi_balance[_coin]}) is insufficient in huobi.`;
                return this.getRet(res, message);

            }

            message = `${sType} amount(${huobi_balance[_coin].free} < ${amount}) is insufficient in huobi.`;
            return this.getRet(res, message);
        }

        console.log("amount:", huobi_balance[_coin].free, ",", amount)
        amount = Math.min(huobi_balance[_coin].free, amount);

        let symbol = type == 1 ? coin + '/' + basecoin : basecoin + '/' + coin;
        let huobi_tradingfeePercent = await this.huobipro.fetchTradingFee(symbol);
        console.log('huobi_tradingfeePercent ' + symbol + '=', huobi_tradingfeePercent)
        let huobi_tradingfeePer = (huobi_tradingfeePercent.maker + huobi_tradingfeePercent.taker);
        console.log('huobi_tradingfeePercent ' + symbol + '=', huobi_tradingfeePer)

        // const step = 1 / Math.pow(10, countDecimals(huobi_tradingfeePer));
        while (true) {
            const ticker = await this.huobipro.fetchTickers([symbol]);
            let realAmount = amount;
            if (type == 1) { // buy
                realAmount = amount / ticker[symbol].ask;
            }
            console.log(realAmount, ", ", huobi_tradingfeePer);
            const precision = type == 1 ? this.huobi_currencies[coin].precision : this.huobi_currencies[basecoin].precision;
            console.log("precision = ", precision);
            let huobi_realAmountCoin = toFixed(realAmount * (1 - huobi_tradingfeePer), countDecimals(precision));
            console.log('huobi_realAmountCoin ' + _coin + '=', huobi_realAmountCoin);

            if (huobi_realAmountCoin <= 0) {
                message = `${coin} amount(${huobi_realAmountCoin}) to ${sType} is insufficient in huobi`;
                // console.log(message);
                break;
            }
            else {
                try {
                    const huobi_order = await this.huobipro.createOrder(symbol, 'market', sType, huobi_realAmountCoin, type == 1 ? ticker[symbol].ask : ticker[symbol].bid);
                    message = `${sType}ed coin in huobi.`;

                    let find = false;
                    while (true) {
                        const trades = await this.huobipro.fetchMyTrades(symbol);
                        for (let i = trades.length - 1; i >= 0; i--) {
                            if (trades[i].order == huobi_order.id) {
                                res = type == 1 ? trades[i].amount : trades[i].cost;
                                find = true;
                                break;
                            }
                        }

                        if (find === true)
                            break;

                    }

                    console.log(huobi_order, ",", res);
                    break;
                }
                catch (error) {
                    message = error.message;
                    if (message.includes('{"code":20001')) {
                        console.log(huobi_tradingfeePer);
                        huobi_tradingfeePer = huobi_tradingfeePer + 0.01;
                        continue;
                    }
                    else {

                        break;
                    }

                }

            }

        }

        return this.getRet(res, message);
    }

    async trade_hitbtc(type, coin, basecoin, amount) {


        let res = -1;
        let message = 'failed to trade coin in hitbtc.';

        let sType = type == 1 ? "buy" : "sell";
        console.log(`/// ${sType} coin in hitbtc.`);

        if (amount == 0) {
            message = `${sType} amount is zero in hitbtc`;
            return this.getRet(res, message);
        }

        const _coin = basecoin;
        let hitbtc_balance = await this.hitbtcpro.fetchBalance({ 'type': 'spot' });
        const checkingAmount = await this.checkAmount(hitbtc_balance, _coin, amount, ECase.ehitbtc_trade);
        if (checkingAmount === false) {
            if (hitbtc_balance[_coin] === undefined) {
                message = `${sType} amount(${hitbtc_balance[_coin]}) is insufficient in hitbtc spot.`;
                return this.getRet(res, message);
            }
            message = `${sType} amount(${hitbtc_balance[_coin].free} : ${amount}) is insufficient in hitbtc spot.`;
            return this.getRet(res, message);
        }

        console.log("amount:", hitbtc_balance[_coin].free, ",", amount)
        amount = Math.min(hitbtc_balance[_coin].free, amount);


        let symbol = type == 1 ? coin + '/' + basecoin : basecoin + '/' + coin;
        let hitbtc_tradingfeePercent = await this.hitbtcpro.fetchTradingFee(symbol);
        console.log("hitbtc_tradingfeePercent = ", hitbtc_tradingfeePercent)
        let hitbtc_tradingfeePer = (hitbtc_tradingfeePercent.maker + hitbtc_tradingfeePercent.taker);
        console.log("hitbtc_tradingfeePer = ", hitbtc_tradingfeePer)

        // const step = 1 / Math.pow(10, countDecimals(hitbtc_tradingfeePer));
        while (true) {
            const ticker = await this.hitbtcpro.fetchTickers([symbol]);
            let realAmount = amount;
            if (type == 1) { // buy
                realAmount = amount / ticker[symbol].ask;
            }
            console.log(`ticker ${symbol} = `, ticker[symbol].ask);
            console.log("amount = ", realAmount);

            const precision = type == 1 ? this.hitbtc_currencies[coin].precision : this.hitbtc_currencies[basecoin].precision;
            console.log("precision = ", precision);
            let hitbtc_realCoinAmount = toFixed(realAmount * (1 - hitbtc_tradingfeePer), countDecimals(precision));
            console.log('hitbtc_realCoinAmount ' + _coin + '=', hitbtc_realCoinAmount);


            if (hitbtc_realCoinAmount <= 0) {
                message = `coin amount(${hitbtc_realCoinAmount}) to ${sType} is insufficient in hitbtc spot`;
                // console.log(message);
                break;
            }
            else {
                try {
                    const hitbtc_order = await this.hitbtcpro.createOrder(symbol, 'market', sType, hitbtc_realCoinAmount, type == 1 ? ticker[symbol].ask : ticker[symbol].bid);
                    message = `${sType}ed coin in hitbtc.`;

                    let find = false;
                    while (true) {
                        const trades = await this.hitbtcpro.fetchMyTrades(symbol);
                        for (let i = trades.length - 1; i >= 0; i--) {
                            if (trades[i].info.order_id == hitbtc_order.info.id) {
                                res = type == 1 ? trades[i].amount : trades[i].cost;
                                find = true;
                                break;
                            }
                        }

                        if (find === true)
                            break;

                    }

                    console.log(hitbtc_order, ",", res);
                    break;
                }
                catch (error) {
                    let message = error.message;
                    if (message.includes('{"code":20001')) {
                        console.log(message);
                        // console.log(hitbtc_tradingfeePer);
                        hitbtc_tradingfeePer = hitbtc_tradingfeePer + 0.01;
                        console.log(hitbtc_tradingfeePer);
                        continue;

                    }
                    else {
                        break;
                    }

                }
            }
        }

        return this.getRet(res, message);

    }

    async transfer_hitbtc(type, coin, amount) {

        let res = -1;
        let message = 'failed to transfer wallet-spot in hitbtc.';

        let sType = type == 1 ? "wallet-spot" : "spot-wallet";
        console.log(`/// ${sType} transfer ${coin} in hitbtc.`);

        if (amount == 0) {
            message = `${sType} amount is zero in hitbtc`;
            return this.getRet(res, message);
        }

        let hitbtc_balance;
        let checkingAmount;

        if (type == 1) {
            hitbtc_balance = await this.hitbtcpro.fetchBalance({ 'type': 'wallet' });
            checkingAmount = await this.checkAmount(hitbtc_balance, coin, amount, ECase.ehitbtc_transferWS);
        }
        else {
            hitbtc_balance = await this.hitbtcpro.fetchBalance({ 'type': 'spot' });
            console.log(hitbtc_balance)
            checkingAmount = await this.checkAmount(hitbtc_balance, coin, amount, ECase.ehitbtc_transferSW);
        }


        if (checkingAmount === false) {
            if (hitbtc_balance[coin] === undefined) {
                message = `${sType} amount(${hitbtc_balance[coin]}) is insufficient in hitbtc.`;
                return this.getRet(res, message);
            }

            message = `${sType} amount(${hitbtc_balance[coin].free} : ${amount}) is insufficient in hitbtc.`;
            return this.getRet(res, message);
        }
        console.log("amount:", hitbtc_balance[coin].free, ",", amount)
        // amount = toFixed(Math.min(hitbtc_balance[coin].free, amount), 6);

        try {
            let hitbtc_transfer;

            let precision = this.hitbtc_currencies[coin].precision
            console.log(precision);
            amount = toFixed(amount, countDecimals(precision));
            console.log(amount);

            if (type == 1) {
                hitbtc_transfer = await this.hitbtcpro.transfer(coin, amount, 'wallet', 'spot');
            }
            else {
                hitbtc_transfer = await this.hitbtcpro.transfer(coin, amount, 'spot', 'wallet');
            }
            console.log(hitbtc_transfer);
            message = `${sType} transfered ${coin} in hitbtc.`;
            res = hitbtc_transfer.amount === undefined ? amount : hitbtc_transfer.amount;
        }
        catch (error) {
            message = error.message;
            console.log(message);
        }

        return this.getRet(res, message);
    }

    async convert_hitbtc(coin, net, convertedcoin, convertednet, amount, direction) {

        let res = -1;
        let message = `failed to convert ${coin} in hitbtc.`;

        console.log(`/// convert ${coin} in hitbtc.`);

        if (amount == 0) {
            message = `${coin} converted amount is zero in hitbtc`;
            return this.getRet(res, message);
        }

        let fromNetwork = this.hitbtc_currencies[coin].networks[net].network;
        let toNetwork = this.hitbtc_currencies[convertedcoin].networks[convertednet].network;
        let hitbtc_balance = await this.hitbtcpro.fetchBalance({ 'type': 'wallet' });
        console.log(fromNetwork, ",", toNetwork);

        let precision = this.hitbtc_currencies[coin].precision
        console.log(precision);
        amount = toFixed(amount, countDecimals(precision));
        console.log(amount);

        const checkingAmount = await this.checkAmount(hitbtc_balance, coin, amount, ECase.ehitbtc_convert);
        if (checkingAmount === false) {
            if (hitbtc_balance[coin] === undefined) {
                message = `${coin} amount(${hitbtc_balance[coin]}) to convert is insufficient in hitbtc.`;
                return this.getRet(res, message);
            }
            message = `${coin} amount(${hitbtc_balance[coin].free} : ${amount}) to convert is insufficient in hitbtc.`;
            return this.getRet(res, message);
        }
        console.log("amount:", hitbtc_balance[coin].free, ",", amount);

        try {
            let hitbtc_conversion;
            if (direction == 0) {
                hitbtc_conversion = await this.hitbtcpro.convertCurrencyNetwork(convertedcoin, amount, fromNetwork, toNetwork);
            }
            else {
                hitbtc_conversion = await this.hitbtcpro.convertCurrencyNetwork(coin, amount, fromNetwork, toNetwork);
            }

            res = hitbtc_conversion.amount === undefined ? amount : hitbtc_conversion.amount;
            message = `converted ${coin} in hitbtc.`;
            console.log(hitbtc_conversion);
        }
        catch (error) {
            message = error.message;
            console.log(message);
        }

        return this.getRet(res, message);
    }

    async checkAmount(balance, coin, amount, ecase) {

        let timebreak = false;
        const start = Date.now();
        let i = 0;

        while (true) {

            const millis = Date.now() - start;
            // console.log(millis, ",", i);
            if (millis >= i * 10000) {
                console.log("///", coin, balance[coin], ",", amount);
                i = i + 1;
            }
            if (millis > this.timeOut * 1000) {
                timebreak = true;
                break;
            }

            if (ecase === ECase.ehitbtc_transferWS || ecase === ECase.ehitbtc_withdraw || ecase === ECase.ehitbtc_convert) { // convert and transfer in hitbtc
                let hitbtc_balance = await this.hitbtcpro.fetchBalance({ 'type': 'wallet' });
                balance[coin] = hitbtc_balance[coin];
            }
            else if (ecase === ECase.ehitbtc_trade || ecase === ECase.ehitbtc_transferSW) {
                let hitbtc_balance = await this.hitbtcpro.fetchBalance({ 'type': 'spot' });
                balance[coin] = hitbtc_balance[coin];

            }
            else if (ecase == ECase.ehuobi_trade || ecase === ECase.ehuobi_withdraw) {
                let huobi_balance = await this.huobipro.fetchBalance();
                balance[coin] = huobi_balance[coin];
            }

            if (balance[coin] == undefined) {
                // console.log(balance, ", ", amount);
                continue;
            }


            // if ((Math.abs(balance[coin].free - amount) <= this.difference) || (balance[coin].free - amount >= 0)) {
            if (balance[coin].free - amount >= 0) {
                console.log(balance[coin]);
                break;
            }

        }

        if (timebreak === true) {
            return false;
        }

        return true;

    }

    async withdraw_huobi(coinWithdraw, netWithdraw, coinDeposit, netDeposit, amount) {

        let res = -1;
        let message = `failed to withdraw ${coinWithdraw} in huobi.`;

        console.log(`/// withdraw ${coinWithdraw} in Huobi.`);
        if (amount == 0) {
            message = `${coinWithdraw} withdraw amount is zero in huobi`;
            return this.getRet(res, message);
        }

        let huobi_balance = await this.huobipro.fetchBalance();

        const checkingAmount = await this.checkAmount(huobi_balance, coinWithdraw, amount, ECase.ehuobi_withdraw);
        if (checkingAmount === false) {
            if (huobi_balance[coinWithdraw] === undefined) {
                message = `balance amount(${huobi_balance[coinWithdraw]}) to withdraw is insufficient in huobi.`;
                return this.getRet(res, message);

            }
            message = `balance amount(${huobi_balance[coinWithdraw].free} : ${amount}) to withdraw is insufficient in huobi.`;
            return this.getRet(res, message);
        }
        console.log("amount:", huobi_balance[coinWithdraw].free, ",", amount)
        amount = Math.min(huobi_balance[coinWithdraw].free, amount);

        // get withdraw amount in huobi
        let huobi_withdrawfee = this.huobi_currencies[coinWithdraw].networks[netWithdraw].fee;
        console.log("amount:", huobi_balance[coinWithdraw].free, ",", amount)

        if (amount > huobi_balance[coinWithdraw].free) {
            message = `${coinWithdraw} amount(${amount} > ${huobi_balance[coinWithdraw].free}) to withdraw is insufficient in huobi.`;
            console.log(message);
            // console.log(this.getRet(res, message));
            return this.getRet(res, message);
        }

        let precision = this.huobi_currencies[coinWithdraw].precision
        console.log(precision);
        let huobi_withdrawAmount = toFixed(amount - huobi_withdrawfee, countDecimals(precision));
        let huobi_baseChain = this.huobi_currencies[coinWithdraw].networks[netWithdraw].info.baseChain;

        // hitbtc deposit information
        let hitbtc_network = this.hitbtc_currencies[coinDeposit].networks[netDeposit].network;
        let deposit = await this.hitbtcpro.fetchDepositAddress(coinDeposit, { 'network': hitbtc_network });
        let hitbtc_depositAddress = deposit.address;
        let hitbtc_depositTag = deposit.tag;

        // console.log(huobi_withdrawAmount, ",", amount, ",", huobi_withdrawfee);
        console.log(`hitbtc_depositAddress ${coinDeposit} =`, hitbtc_depositAddress);
        console.log(`hitbtc_depositTag ${coinDeposit} =`, hitbtc_depositTag);
        console.log(`huobi_withdrawAmount ${coinWithdraw} =`, huobi_withdrawAmount);
        console.log(`huobi_baseChain ${coinWithdraw} =`, huobi_baseChain);

        // withdraw in huobi
        if (huobi_withdrawAmount <= 0) {
            message = `${coinWithdraw} amount(${huobi_withdrawAmount}) to withdraw is insufficient in huobi.`;
            console.log(message);
            return this.getRet(res, message);
        }
        else {

            try {
                // const ll = await this.huobipro.fetchCurrencies();
                // console.log(ll['USDD'])
                console.log(coinWithdraw, huobi_withdrawAmount, hitbtc_depositAddress, hitbtc_depositTag);
                // let transaction = await this.huobipro.withdraw(coin, huobi_withdrawAmount, hitbtc_depositAddress, hitbtc_depositTag, { "network": huobi_baseChain });
                let transaction = await this.huobipro.withdraw(coinWithdraw, huobi_withdrawAmount, hitbtc_depositAddress, hitbtc_depositTag);
                message = `withdrawed ${coinWithdraw} in huobi.`;
                // res = transaction.amount === undefined ? huobi_withdrawAmount : transaction.amount;
                res = transaction.id;
                console.log(transaction);
            }
            catch (error) {
                message = error.message;
                console.log(message);
            }
        }

        return this.getRet(res, message);
    }

    async withdraw_hitbtc(coinWithdraw, netWithdraw, coinDeposit, netDeposit, amount) {

        let res = -1;
        let message = `failed to withdraw ${coinWithdraw} in hitbtc.`;

        console.log(`/// withdraw ${coinWithdraw} in hitbtc.`);
        if (amount == 0) {
            message = `${coinWithdraw} withdraw amount is zero in hitbtc`;
            return this.getRet(res, message);
        }

        // get withdraw amount in hitbtc
        let hitbtc_balance = await this.hitbtcpro.fetchBalance({ 'type': 'wallet' });
        const checkingAmount = await this.checkAmount(hitbtc_balance, coinWithdraw, amount, ECase.ehitbtc_withdraw);
        if (checkingAmount === false) {
            if (hitbtc_balance[coinWithdraw] === undefined) {
                message = `balance amount(${hitbtc_balance[coinWithdraw]}) to withdraw is insufficient in hitbtc.`;
                return this.getRet(res, message);

            }
            message = `balance amount(${hitbtc_balance[coinWithdraw].free} : ${amount}) to withdraw is insufficient in hitbtc.`;
            return this.getRet(res, message);
        }
        console.log("amount:", hitbtc_balance[coinWithdraw].free, ",", amount)
        amount = Math.min(hitbtc_balance[coinWithdraw].free, amount);


        let hitbtc_network = this.hitbtc_currencies[coinWithdraw].networks[netWithdraw].network;
        let hitbtc_transfee = this.hitbtc_currencies[coinWithdraw].fee;

        let precision = this.hitbtc_currencies[coinWithdraw].precision
        console.log(precision);
        let hitbtc_withdrawAmount = toFixed(amount - hitbtc_transfee, countDecimals(precision));
        console.log(`hitbtc_withdrawAmount ${coinWithdraw}=`, hitbtc_withdrawAmount);
        console.log(`hitbtc_transfee ${coinWithdraw}=`, hitbtc_transfee);


        let huobi_deposits = await this.huobipro.fetchDepositAddressesByNetwork(coinDeposit);
        if (huobi_deposits[netDeposit] == undefined) {
            message = `there is not selected network ${net}`;
            return this.getRet(res, message);
        }

        let huobi_depositAddress = huobi_deposits[netDeposit].address;
        let huobi_depositTag = huobi_deposits[netDeposit].tag;
        console.log(`huobi_depositAddress ${coinDeposit}= `, huobi_depositAddress);
        console.log(`huobi_depositTag ${coinDeposit}= `, huobi_depositTag);


        if (hitbtc_withdrawAmount <= 0) {
            message = `withdraw amount(${hitbtc_withdrawAmount} : ${amount}) is negative(0) in hitbtc`;
            // console.log(message);
            return this.getRet(res, message);
        }
        else {

            try {
                // let transaction = await this.hitbtcpro.withdraw(coinWithdraw, hitbtc_withdrawAmount, huobi_depositAddress, huobi_depositTag, { "network": hitbtc_network });
                let transaction = await this.hitbtcpro.withdraw(coinWithdraw, hitbtc_withdrawAmount, huobi_depositAddress, huobi_depositTag);
                // res = transaction.amount == undefined ? hitbtc_withdrawAmount : hitbtc_withdrawAmount.amount;
                res = transaction.id;
                message = `withdrawed ${coinWithdraw} in hitbtc.`;
                console.log(transaction);
            }
            catch (error) {
                message = error.message;
                console.log(message);
            }
        }

        return this.getRet(res, message);
    }

    async checkingWithdraw_huobi(coin, id) {

        let res = -1;
        let message = 'failed to check withdraw in huobi.';

        let huobi_withdraws = await this.huobipro.fetchWithdrawals(coin);
        if (huobi_withdraws.length <= 0) {
            message = "didn't withdraw yet in huobi.";
            console.log(message);
            return this.getRet(res, message);
        }

        let amount;
        let withdrawidx;
        for (let i = huobi_withdraws.length - 1; i >= 0; i--) {
            const transid = huobi_withdraws[i].id;
            if (transid == id) {
                amount = huobi_withdraws[i].amount;
                withdrawidx = i;
                break;
            }

        }

        if (amount != undefined && withdrawidx != undefined) {
            let hitbtc_deposits = await this.hitbtcpro.fetchDeposits(coin);
            let bdeposit = false;
            for (let i = hitbtc_deposits.length - 1; i >= 0; i--) {
                // console.log(hitbtc_deposits[i]);
                if ((hitbtc_deposits[i].address === huobi_withdraws[withdrawidx].address) &&
                    hitbtc_deposits[i].timestamp >= huobi_withdraws[withdrawidx].timestamp &&
                    amount == hitbtc_deposits[i].amount) {
                    message = 'checked to withdraw in huobi.';
                    res = amount;
                    console.log(message, ",", res);
                    break;
                }
            }

        }

        return this.getRet(res, message);
    }

    async checkingWithdraw_hitbtc(coin, id) {

        let res = -1;
        let message = 'failed to check withdraw in hitbtc.';

        let hitbtc_withdraws = await this.hitbtcpro.fetchWithdrawals(coin);
        if (hitbtc_withdraws.length <= 0) {
            message = "didn't withdraw yet in hitbtc.";
            // console.log(message);
            return this.getRet(res, message);
        }

        let amount;
        let withdrawidx;
        for (let i = hitbtc_withdraws.length - 1; i >= 0; i--) {
            const transid = hitbtc_withdraws[i].info.native.tx_id;
            if (transid == id) {
                amount = hitbtc_withdraws[i].amount;
                withdrawidx = i;
                break;
            }

        }

        // console.log(hitbtc_withdraws[hitbtc_withdraws.length - 1].amount);
        // console.log(hitbtc_withdraws[hitbtc_withdraws.length - 1].timestamp);

        let huobi_deposits = await this.huobipro.fetchDeposits(coin);


        // console.log(huobi_deposits[huobi_deposits.length-1].address);
        // console.log(hitbtc_withdraws[hitbtc_withdraws.length - 1].address);
        if (amount != undefined && withdrawidx != undefined) {
            for (let i = huobi_deposits.length - 1; i >= 0; i--) {
                if ((huobi_deposits[i].address === hitbtc_withdraws[withdrawidx].address) &&
                    (huobi_deposits[i].timestamp >= hitbtc_withdraws[withdrawidx].timestamp) &&
                    amount == huobi_deposits[i].amount) {
                    message = 'checked to withdraw in hitbic.';
                    res = amount;
                    console.log(message, ",", res);
                    break;
                }
            }
        }


        return this.getRet(res, message);
    }

}

const Trader = new ExchangeTrade();

async function _getCryptoCurrencies_huobi(req, res) {
    const currencies = await Trader.getCryptoCurrencies_huobi();
    res.json(currencies);
}

async function _getCryptoCurrencies_hitbtc(req, res) {
    const currencies = await Trader.getCryptoCurrencies_hitbtc();
    res.json(currencies);
}

async function _is_tradingSymbol(req, res) {
    const exchange = parseInt(req.query.exchange);
    const coin1 = req.query.coin1;
    const coin2 = req.query.coin2;

    const isSymbol = await Trader.is_tradingSymbol(coin1, coin2, exchange);
    res.json(isSymbol);
}

async function _trade_huobi(req, res) {

    const type = parseInt(req.query.type);
    const coin = req.query.coin;
    const basecoin = req.query.basecoin;
    const amount = parseFloat(req.query.amount);

    if (amount <= 0) {
        res.json(amount);
        return;
    }

    const trade = await Trader.trade_huobi(type, coin, basecoin, amount);
    res.json(trade);
}

async function _trade_hitbtc(req, res) {

    const type = parseInt(req.query.type);
    const coin = req.query.coin;
    const basecoin = req.query.basecoin;
    const amount = parseFloat(req.query.amount);

    if (amount <= 0) {
        res.json(amount);
        return;
    }


    const trade = await Trader.trade_hitbtc(type, coin, basecoin, amount);
    res.json(trade);
}

async function _transfer_hitbtc(req, res) {

    const type = parseInt(req.query.type);
    const coin = req.query.coin;
    const amount = parseFloat(req.query.amount);

    if (amount <= 0) {
        res.json(amount);
        return;
    }

    const transfer = await Trader.transfer_hitbtc(type, coin, amount);
    res.json(transfer);
}

async function _convert_hitbtc(req, res) {

    const coin = req.query.coin;
    const net = req.query.net;
    const convertedcoin = req.query.convertedcoin;
    const convertednet = req.query.convertednet;
    const amount = parseFloat(req.query.amount);
    const direction = parseInt(req.query.direction);

    if (amount <= 0) {
        res.json(amount);
        return;
    }

    const conversion = await Trader.convert_hitbtc(coin, net, convertedcoin, convertednet, amount, direction);
    res.json(conversion);
}

async function _withdraw_huobi(req, res) {

    const coinWithdraw = req.query.coinWithdraw;
    const netWithdraw = req.query.netWithdraw;
    const coinDeposit = req.query.coinDeposit;
    const netDeposit = req.query.netDeposit;
    const amount = parseFloat(req.query.amount);

    if (amount <= 0) {
        res.json(Trader.getRet(-1, "withdraw amount < 0"));
        return;
    }

    const withdraw = await Trader.withdraw_huobi(coinWithdraw, netWithdraw, coinDeposit, netDeposit, amount);
    res.json(withdraw);
}

async function _withdraw_hitbtc(req, res) {

    const coinWithdraw = req.query.coinWithdraw;
    const netWithdraw = req.query.netWithdraw;
    const coinDeposit = req.query.coinDeposit;
    const netDeposit = req.query.netDeposit;
    const amount = parseFloat(req.query.amount);

    if (amount <= 0) {
        res.json(amount);
        return;
    }

    const withdraw = await Trader.withdraw_hitbtc(coinWithdraw, netWithdraw, coinDeposit, netDeposit, amount);
    res.json(withdraw);
}

async function _checkingWithdraw_huobi(req, res) {
    const coin = req.query.coin;
    const id = req.query.id;

    const checking = await Trader.checkingWithdraw_huobi(coin, id);
    res.json(checking);
}

async function _checkingWithdraw_hitbtc(req, res) {
    const coin = req.query.coin;
    const id = req.query.id;

    const checking = await Trader.checkingWithdraw_hitbtc(coin, id);
    res.json(checking);
}

async function _getbalance_hitbtc(req, res) {
    const coin = req.query.coin;
    const balance = await Trader.hitbtcpro.fetchBalance({ 'type': 'wallet' });
    res.json(Trader.getRet(balance[coin], "balance"));
}

async function _getbalance_huobi(req, res) {
    const coin = req.query.coin;
    const balance = await Trader.huobipro.fetchBalance();
    // console.log(balance[coin])
    res.json(Trader.getRet(balance[coin], "balance"));
}


async function _getMatchedCoinNets(req, res) {
    const coinMap = await Trader.getMatchedCoinNets();
    const matchedCoins = Object.fromEntries(coinMap);

    res.json(Trader.getRet(matchedCoins, "Coin And Net Map"));
}

async function _getTickData(req, res) {
    const exchange = req.query.exchange;
    const symbol = req.query.symbol;

    let ticker;
    if (exchange.toLowerCase() === "huobi") {
        ticker = await Trader.huobipro.fetchTickers([symbol]);
    }
    else if (exchange.toLowerCase() === "hitbtc") {
        ticker = await Trader.hitbtcpro.fetchTickers([symbol]);
    }

    if (ticker[symbol] == undefined) {
        res.json(Trader.getRet(undefined, "ticker Data"));
    }
    else {
        res.json(Trader.getRet(ticker[symbol].ask, "ticker Data"));
    }

}



module.exports = {
    _getCryptoCurrencies_huobi,
    _getCryptoCurrencies_hitbtc,
    _is_tradingSymbol,
    _trade_huobi,
    _trade_hitbtc,
    _transfer_hitbtc,
    _convert_hitbtc,
    _withdraw_huobi,
    _withdraw_hitbtc,
    _checkingWithdraw_huobi,
    _checkingWithdraw_hitbtc,
    _getbalance_hitbtc,
    _getbalance_huobi,
    _getMatchedCoinNets,
    _getTickData,
    _balance,
    _buycoin1,
    _sellcoin2,
    _withdraw_coin,
    _conv_coins
}

async function fetchDepositAddr(exchange_name, coin, networkname) {
    let arr = "";
    let address;
    if(exchange_name == "Kraken") {
        try {
            arr = await Trader.kraken.fetchDepositAddress(coin, {'network': networkname});            
        }catch (error) {
            arr = "";
        }
    }
    else if(exchange_name == "Binance") {
        try {
            arr = await Trader.binance.fetchDepositAddress(coin, {'network': networkname});            
        }catch (error) {
            arr = "";
        }
    }
    else if(exchange_name == "Kucoin") {
        try {
            arr = await Trader.kucoin.fetchDepositAddress(coin, {'network': networkname});            
        }catch (error) {
            arr = "";
        }
    }
    else if(exchange_name == "EXMO") {
        try {
            arr = await Trader.exmo.fetchDepositAddress(coin, {'network': networkname});            
        }catch (error) {
            arr = "";
        }
    }
    else if(exchange_name == "Bitfinex") {
        try {
            arr = await Trader.bitfinex.fetchDepositAddress(coin, {'network': networkname});            
        }catch (error) {
            arr = "";
        }
    }
    else if(exchange_name == "Coinbase") {
        try {
            arr = await Trader.coinbasepro.fetchDepositAddress(coin, {'network': networkname});            
        }catch (error) {
            arr = "";
        }
    }
    if(arr == "")
        return "";
    return arr.address;
}
async function _conv_coins(req, res) {
    const amount = req.query.amount;
    const coin1 = req.query.coin1;
    const coin2 = req.query.coin2;
    const exchange_name = req.query.exchange;
    let symbol1 = coin1 + "/" + coin2;
    let symbol2 = coin2 + "/" + coin1;
    let symbol = "";
    let ticker;
    let mode = 0;
    let markets;
    if(exchange_name == "Binance") {
        markets = await Trader.binance.loadMarkets();
    }
    else if(exchange_name == "Kucoin") {
        markets = await Trader.kucoin.loadMarkets(); 
    }
    else if(exchange_name == "Kraken") {
        markets = await Trader.kraken.loadMarkets(); 
    }
    else if(exchange_name == "Coinbase") {
        markets = await Trader.coinbasepro.loadMarkets(); 
    }
    else if(exchange_name == "EXMO") {
        markets = await Trader.exmo.loadMarkets(); 
    }
    else if(exchange_name == "Bitfinex") {
        markets = await Trader.bitfinex.loadMarkets(); 
    }
    if(symbol1 in markets) {
        symbol = symbol1;
    }
    if(symbol2 in markets) {
        symbol = symbol2;
        mode = 1;
    }
    if(symbol == "") {
        res.json("error");
        return;
    }
    try {
        if(exchange_name == "Binance") {
            ticker = await Trader.binance.fetchTicker(symbol);
            if(mode == 1) {        
                buyamount = amount / ticker.bid;
                buyamount = buyamount.toFixed(4);
                response = await Trader.binance.createOrder(symbol, 'market',  "buy", buyamount);
            }
            else {
                buyamount = amount;
                response = await Trader.binance.createOrder(symbol, 'market',  "sell", buyamount);
            }
        }
        if(exchange_name == "Kucoin") {
            ticker = await Trader.kucoin.fetchTicker(symbol);
            if(mode == 1) {        
                buyamount = amount / ticker.bid;
                buyamount = buyamount.toFixed(4);
                response = await Trader.kucoin.createOrder(symbol, 'market',  "buy", buyamount);
            }
            else {
                buyamount = amount;
                response = await Trader.kucoin.createOrder(symbol, 'market',  "sell", buyamount);
            }
        }
        if(exchange_name == "Kraken") {
            ticker = await Trader.kraken.fetchTicker(symbol);
            if(mode == 1) {        
                buyamount = amount / ticker.bid;
                buyamount = buyamount.toFixed(4);
                response = await Trader.kraken.createOrder(symbol, 'market',  "buy", buyamount);
            }
            else {
                buyamount = amount;
                response = await Trader.kraken.createOrder(symbol, 'market',  "sell", buyamount);
            }
        }
        if(exchange_name == "Coinbase") {
            ticker = await Trader.coinbasepro.fetchTicker(symbol);
            if(mode == 1) {        
                buyamount = amount / ticker.bid;
                buyamount = buyamount.toFixed(4);
                response = await Trader.coinbasepro.createOrder(symbol, 'market',  "buy", buyamount);
            }
            else {
                buyamount = amount;
                response = await Trader.coinbasepro.createOrder(symbol, 'market',  "sell", buyamount);
            }
        }
        if(exchange_name == "EXMO") {
            ticker = await Trader.exmo.fetchTicker(symbol);
            if(mode == 1) {        
                buyamount = amount / ticker.bid;
                buyamount = buyamount.toFixed(4);
                response = await Trader.exmo.createOrder(symbol, 'market',  "buy", buyamount);
            }
            else {
                buyamount = amount;
                response = await Trader.exmo.createOrder(symbol, 'market',  "sell", buyamount);
            }
        }
        if(exchange_name == "Bitfinex") {
            ticker = await Trader.bitfinex.fetchTicker(symbol);
            if(mode == 1) {        
                buyamount = amount / ticker.bid;
                buyamount = buyamount.toFixed(4);
                response = await Trader.bitfinex.createOrder(symbol, 'market',  "buy", buyamount);
            }
            else {
                buyamount = amount;
                response = await Trader.bitfinex.createOrder(symbol, 'market',  "sell", buyamount);
            }
        }
    }
    catch (e){
        response = "error";
    }
    if(response != "error")
        res.json(buyamount);
    else
        res.json(response);
}
async function _withdraw_coin(req, res) {
    const amount = req.query.amount;
    const coin = req.query.coin;
    const main = req.query.main;
    const exchange1 = req.query.exchange1;
    const exchange2 = req.query.exchange2;
    const network = req.query.network;
    const addinf = req.query.addinf;
    console.log(coin1, network);
    let depAddr = await fetchDepositAddr(exchange2, coin, network);
    console.log(depAddr);
    let response = "success";
    try {
        if(exchange1 == "Kucoin") {
            let transaction = await Trader.kucoin.withdraw(coin,amount, depAddr, addinf, {'network': network, 'key':addinf});
            console.log(transaction);
        }
        else if(exchange1 == "Kraken") {
            let transaction = await Trader.kraken.withdraw(coin,amount, depAddr, addinf, {'network': network, 'key':addinf});
            console.log(transaction);
        }
        else if(exchange1 == "Binance") {
            let transaction = await Trader.binance.withdraw(coin,amount, depAddr, addinf, {'network': network, 'key':addinf});
            console.log(transaction);
        }
        else if(exchange1 == "Bitfinex") {
            let transaction = await Trader.bitfinex.withdraw(coin,amount, depAddr, addinf, {'network': network, 'key':addinf});
            console.log(transaction);
        }
        else if(exchange1 == "Coinbase") {
            let transaction = await Trader.coinbasepro.withdraw(coin,amount, depAddr, addinf, {'network': network, 'key':addinf});
            console.log(transaction);
        }
        else if(exchange1 == "EXMO") {
            let transaction = await Trader.exmo.withdraw(coin,amount, depAddr, addinf, {'network': network, 'key':addinf});
            console.log(transaction);
        }
    }
    catch(e) {
        response = "error";
    }
    res.json(response);
}
async function get_balance(exchange_name) {
    let balance;
    try {
        if(exchange_name == "Binance") {
            balance = await Trader.binance.fetchBalance();
        }
        else if(exchange_name == "Kucoin") {
            balance = await Trader.kucoin.fetchBalance();
        }
        else if(exchange_name == "Kraken") {
            balance = await Trader.kraken.fetchBalance();
        }
        else if(exchange_name == "EXMO") {
            balance = await Trader.exmo.fetchBalance();
        }
        else if(exchange_name == "Coinbase") {
            balance = await Trader.coinbasepro.fetchBalance();
        }
        else if(exchange_name == "Bitfinex") {
            balance = await Trader.bitfinex.fetchBalance();
        }
    }
    catch(error) {
        response = "error";
    }
    return balance;
}
async function _sellcoin2(req, res) {
    const amount = req.query.amount;
    const coin2 = req.query.coin2;
    const main = req.query.main;
    const exchange_name = req.query.exchange;
    let symbol = coin2 + "/" + main;
    let response;
    let ticker;
    if(exchange_name == "Binance") {
        try {
            ticker = await Trader.binance.fetchTickers([symbol]);
            response = await Trader.binance.createOrder(symbol, 'market',  "sell", amount);
        }catch (error) {
            response = "error";
        }
    }
    else if(exchange_name == "Kucoin") {
        try {
            ticker = await Trader.kucoin.fetchTickers([symbol]);
            //console.log(symbol, amount);
            response = await Trader.kucoin.createOrder(symbol, 'market',  "sell", amount);
        } catch (error) {
            response = "error";
        }
        
        //response = await Trader.kucoin.createOrder(symbol, 'market',  "sell", buyamount);
    }
    else if(exchange_name == "Kraken") {
        try {
            ticker = await Trader.kraken.fetchTickers([symbol]);
            response = await Trader.kraken.createOrder(symbol, 'market',  "sell", amount);
        }catch (error) {
            response = "error";
        }
    }
    else if(exchange_name == "EXMO") {
        try {
            ticker = await Trader.exmo.fetchTickers([symbol]);
            response = await Trader.exmo.createOrder(symbol, 'market',  "sell", amount);
        }catch (error) {
            response = "error";
        }
    }
    else if(exchange_name == "Coinbase") {
        try {
            ticker = await Trader.coinbasepro.fetchTickers([symbol]);
            response = await Trader.coinbasepro.createOrder(symbol, 'market',  "sell", amount);
        }catch (error) {
            response = "error";
        }
    }
    else if(exchange_name == "Bitfinex") {
        try {
            ticker = await Trader.bitfinex.fetchTickers([symbol]);
            response = await Trader.bitfinex.createOrder(symbol, 'market',  "sell", amount);
        }catch (error) {
            response = "error";
        }
    }
    res.json(response);
}
async function _buycoin1(req, res) {
    const amount = req.query.amount;
    const coin1 = req.query.coin1;
    const main = req.query.main;
    const exchange_name = req.query.exchange;
    let symbol = coin1 + "/" + main;
    let response;
    let ticker;
    let buyamount;
    if(exchange_name == "Binance") {
        try {
            ticker = await Trader.binance.fetchTickers([symbol]);
            buyamount = amount / ticker[symbol].bid;
            buyamount = buyamount.toFixed(4);

            response = await Trader.binance.createOrder(symbol, 'market',  "buy", buyamount);
        }catch (error) {
            response = "error";
        }
    }
    else if(exchange_name == "Kucoin") {
        try {
            ticker = await Trader.kucoin.fetchTickers([symbol]);
            buyamount = amount / ticker[symbol].bid;
            buyamount = buyamount.toFixed(4);
            console.log(symbol, amount, buyamount);
            response = await Trader.kucoin.createOrder(symbol, 'market',  "buy", buyamount);
        } catch (error) {
            response = "error";
        }
        
        //response = await Trader.kucoin.createOrder(symbol, 'market',  "buy", buyamount);
    }
    else if(exchange_name == "Kraken") {
        try {
            ticker = await Trader.kraken.fetchTickers([symbol]);
            buyamount = amount / ticker[symbol].bid;
            buyamount = buyamount.toFixed(4);

            response = await Trader.kraken.createOrder(symbol, 'market',  "buy", buyamount);
        }catch (error) {
            response = "error";
        }
    }
    else if(exchange_name == "EXMO") {
        try {
            ticker = await Trader.exmo.fetchTickers([symbol]);
            buyamount = amount / ticker[symbol].bid;
            buyamount = buyamount.toFixed(4);

            response = await Trader.exmo.createOrder(symbol, 'market',  "buy", buyamount);
        }catch (error) {
            response = "error";
        }
    }
    else if(exchange_name == "Coinbase") {
        try {
            ticker = await Trader.coinbasepro.fetchTickers([symbol]);
            buyamount = amount / ticker[symbol].bid;
            buyamount = buyamount.toFixed(4);

            response = await Trader.coinbasepro.createOrder(symbol, 'market',  "buy", buyamount);
        }catch (error) {
            response = "error";
        }
    }
    else if(exchange_name == "Bitfinex") {
        try {
            ticker = await Trader.bitfinex.fetchTickers([symbol]);
            buyamount = amount / ticker[symbol].bid;
            buyamount = buyamount.toFixed(4);

            response = await Trader.bitfinex.createOrder(symbol, 'market',  "buy", buyamount);
        }catch (error) {
            response = "error";
        }
    }
    res.json(response);
}

async function _balance(req, res) {
    
    const exchange = req.query.exchange;
    console.log(exchange);
    const balance = await get_balance(exchange);
    res.json(balance);
}