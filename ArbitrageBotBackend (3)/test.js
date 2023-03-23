const ccxt = require('ccxt');
const config = require('./config/key.config');

const huobipro = new ccxt.huobipro({
    apiKey: config.huobi_apiKey,
    secret: config.huobi_secret,
});

const hitbtcpro = new ccxt.hitbtc({

    apiKey: config.hitbtc_apiKey,
    secret: config.hitbtc_secret,
});

const kraken = new ccxt.kraken({

    apiKey: config.kraken_apiKey,
    secret: config.kraken_secret,
});
const kucoin = new ccxt.kucoin({
    'apiKey': config.kucoin_apiKey,
    'secret': config.kucoin_secret,
    'password' : "Universal2023!",
    'enableRateLimit': true,
    'trust': true // enable trust option
});
const bitfinex = new ccxt.bitfinex({

    apiKey: config.bitfinex_apiKey,
    secret: config.bitfinex_secret,
});
const binance = new ccxt.binance({

    apiKey: config.binance_apiKey,
    secret: config.binance_secret,
});
const exmo = new ccxt.exmo({

    apiKey: config.exmo_apiKey,
    secret: config.exmo_secret,
});
const coinbasepro = new ccxt.coinbasepro({

    apiKey: config.coinbase_apiKey,
    secret: config.coinbase_secret,
});

async function btc_usdt_ratio(exchange_name) {
    let symbol = "BTC/USDT";
    let ticker;
    if(exchange_name == "Binance") {
        ticker = await binance.fetchTickers([symbol]);
    }
    else if(exchange_name == "Kucoin") {
        ticker = await kucoin.fetchTickers([symbol]);
    }
    else if(exchange_name == "Kraken") {
        ticker = await kraken.fetchTickers([symbol]);
    }
    else if(exchange_name == "EXMO") {
        ticker = await exmo.fetchTickers([symbol]);
    }
    else if(exchange_name == "Coinbase") {
        ticker = await coinbasepro.fetchTickers([symbol]);
    }
    else if(exchange_name == "Bitfinex") {
        ticker = await bitfinex.fetchTickers([symbol]);
    }
    let buyprice = ticker[symbol].bid;
    let sellprice = ticker[symbol].ask;
    
    return buyprice + ":" + sellprice;
}
async function get_balance_usdt(exchange_name) {
    let balance;
    if(exchange_name == "Binance") {
        balance = await binance.fetchBalance();
    }
    else if(exchange_name == "Kucoin") {
        balance = await kucoin.fetchBalance();
    }
    else if(exchange_name == "Kraken") {
        balance = await kraken.fetchBalance();
    }
    else if(exchange_name == "EXMO") {
        balance = await exmo.fetchBalance();
    }
    else if(exchange_name == "Coinbase") {
        balance = await coinbasepro.fetchBalance();
    }
    else if(exchange_name == "Bitfinex") {
        balance = await bitfinex.fetchBalance();
    }
    return balance;
}
async function buy_btc_by_usdt(exchange_name, amount) {
    let symbol = "BTC/USDT";
    let balance = await get_balance_usdt(exchange_name);

    if(balance['USDT'] == undefined) {
        console.log("Insufficent funds. error line 100");
        return;
    }
    let current_amount = (balance['USDT'].free == undefined) ? 0 : balance['USDT'].free;
    // if(current_amount < amount) {
    //     console.log("Insufficent funds. error line 105");
    //     return;
    // }
    // if(amount < 10) {
    //     console.log("Minimum usdt amount is 10. error line 109");
    //     return;
    // }
    let aa = await kucoin.createOrder(symbol, 'market',  "buy", amount);
    console.log(aa)
}
async function buy_usdt_by_btc(exchange_name, amount) {
    let symbol = "BTC/USDT";
    let balance = await get_balance_usdt(exchange_name);

    if(balance['USDT'] == undefined) {
        console.log("Insufficent funds. error line 100");
        return;
    }
    let current_amount = (balance['USDT'].free == undefined) ? 0 : balance['USDT'].free;
    // if(current_amount < amount) {
    //     console.log("Insufficent funds. error line 105");
    //     return;
    // }
    // if(amount < 10) {
    //     console.log("Minimum usdt amount is 10. error line 109");
    //     return;
    // }
    let aa = await kucoin.createOrder(symbol, 'market',  "sell", amount);
    console.log(aa)
}

async function fetchDepositAddresses() {
    const usdt = 'USDT'

    const erc20DepositAddresses = {}
    const trc20DepositAddresses = {}

    await kraken.loadMarkets()
    //console.log(kraken.markets)
    //for (const currency of kraken.currencies) {
    //  if (currency === usdt) {
        //const erc20Market = kraken.markets[`${usdt}/ERC20`]
        //const erc20Address = await kraken.fetchDepositAddress(usdt, erc20Market.id)
        //erc20DepositAddresses[usdt] = erc20Address.address
  
        const trc20Market = kraken.markets[`${usdt}/TRC20`]
        const trc20Address = await kraken.fetchDepositAddress(usdt, trc20Market.id)
        trc20DepositAddresses[usdt] = trc20Address.address
    //  }
    //}
  
    console.log('ERC-20 deposit addresses:', erc20DepositAddresses)
    console.log('TRC-20 deposit addresses:', trc20DepositAddresses)
  }

async function test() {
    //console.log (huobipro.has);
    //huobipro.setSandboxMode (true);
    //kucoin.setSandboxMode (true);
    //let symbola = "SYN/USDT";
    //let ticker = await kucoin.fetchTickers([symbola]);
    //console.log(ticker);
    
   //Example usage:
    //let aa = await bitfinex.fetchDepositAddress("USDT");
   //console.log(aa);
   let aa = await kucoin.loadMarkets();
   
   const symbola = 'USDT/BTT';
    //let ticker = await kucoin.fetchTicker(symbola);
    //console.log(ticker);
    if(symbola in aa) {
        console.log("exist");
    }
    else
    console.log("not exist");
    return;
const exchangeId = 'binance';
    let symbols = "BNB/USDT";
    await kucoin.loadMarkets();
    console.log(kucoin['networks']);
    let prices = await btc_usdt_ratio("Kucoin"); 
    let prices1 = await btc_usdt_ratio("Kraken"); 
    console.log(prices, prices1);
    await kucoin.load_markets();

    let symbol_pairs = kucoin.symbols;
    console.log(symbol_pairs['USDT/BNB']);

    //await buy_usdt_by_btc("Kucoin", 10);
    
    /*let usdtaddr = await kraken.fetchDepositAddress('USDT', {'network': 'TRC20'});
    let addr = usdtaddr.address;
    console.error(addr);
  
    let transaction = await kucoin.withdraw('USDT',10, addr, "", {'network': 'TRC20'});
    console.log(transaction);*/

    //await buy_usdt_by_btc("Kraken", 0.0001); sell 0.0001btc and buy USDT in kraken.

    /*let usdtaddr = await kucoin.fetchDepositAddress('USDT', {'network': 'TRC20'});
    let addr = usdtaddr.address;
    console.error(addr);

    let transaction = await kraken.withdraw('USDT',9.9845, addr, "", {'key': 'ku'});
    console.log(transaction);
    */
    //await buy_usdt_by_btc("Kucoin", 0.0005);
    //await buy_btc_by_usdt("Kucoin", 0.0001);








     /* let huobi_currencies = await huobipro.fetchCurrencies();
    //console.log(huobi_currencies);
    let net = huobi_currencies['USDT'];//.networks['ERC20'].network;
    console.log(net);
    console.log(huobi_currencies['ATOM'])
    let deposit = await huobipro.fetchDepositAddressesByNetwork("USDT");
    console.log(deposit)

    let deposit1 = await hitbtcpro.fetchDepositAddress("USDT");
    console.log(deposit1)*/



    //let hitbtc_currencies = await hitbtcpro.fetchCurrencies();
    //console.log(hitbtc_currencies['USDT']);
    //let net1 = hitbtc_currencies['USDT'].networks['OMNI'].network;
    //console.log(net1)

    /*try{
        let balance = await huobipro.fetchTickers(["1INCH/USDT"]);
        consolg.log(balance)
    }
    catch(error){
         console.log(error.message);
    }

    try{
        let balance = await hitbtcpro.fetchTickers(["TRX/USDD"]);
        console.log(balance)
    }
    catch(error){
        console.log(error.message);

    }*/



    //let balance1 = await hitbtcpro.fetchBalance({ 'type': 'wallet' });
    //console.log(balance1)
    //console.log(balance1["BTCUSDT"]);
    //let transaction = await hitbtcpro.withdraw('TRX',2, 'TNZz1SChw89rWz8W8sTheG8wjoqy1fFYev', undefined);
    //console.log(transaction);

    // let hitbtc_withdraws = await hitbtcpro.fetchWithdrawals('USDD');

    // let huobi_withdraws = await huobipro.fetchWithdrawals('USDD');
    //let hitbtc_deposits = await hitbtcpro.fetchDeposits('USDD');

    //console.log(huobi_withdraws[huobi_withdraws.length-1].id);
    // console.log(hitbtc_withdraws[hitbtc_withdraws.length-1].info.native.tx_id); 
    // console.log(hitbtc_withdraws[hitbtc_withdraws.length-1].info.native.tx_id); 
    // console.log(huobi_withdraws[huobi_withdraws.length-1]); 
    // console.log(hitbtc_withdraws[hitbtc_withdraws.length-1].info.native.tx_id); 
    // console.log(hitbtc_withdraws[hitbtc_withdraws.length-1]); 
    //console.log(hitbtc_deposits[hitbtc_deposits.length-1]); 
    // console.log(huobi_deposits[0]); 


    // console.log(hitbtc_deposits[huobi_withdraws.length-3]);
    //console.log(hitbtc_deposits);
    // symbol = 'USDD/USDT';

    // let hitbtc_tradingfeePercent = await hitbtcpro.fetchTradingFee(symbol);
    // console.log("hitbtc_tradingfeePercent = ", hitbtc_tradingfeePercent)
    // let hitbtc_tradingfeePer = (hitbtc_tradingfeePercent.maker + hitbtc_tradingfeePercent.taker);

    // while (true) {
    //     const ticker = await hitbtcpro.fetchTickers([symbol]);
    //     try {
    //         // let hitbtc_order = await hitbtcpro.createOrder(symbol, 'market', 'buy', 11/ticker[symbol].ask*(1- hitbtc_tradingfeePer), ticker[symbol].ask);
    //         let hitbtc_order = await hitbtcpro.createOrder(symbol, 'market', 'sell', 11*(1- hitbtc_tradingfeePer), ticker[symbol].bid);
    //         console.log(hitbtc_order);
    //         break;
    //     }
    //     catch (error) {
    //         let message = error.message;
    //         // console.log(message)
    //         if (message.includes('{"code":20001')) {
    //             // console.log(message);
    //             hitbtc_tradingfeePer = hitbtc_tradingfeePer + 0.01;
    //             console.log(hitbtc_tradingfeePer)
    //             continue
    //         }
    //         else {
    //             break;
    //         }
    //     }


    // }
    // function toFixed(num, fixed) {
    //     var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    //     return num.toString().match(re)[0];
    // }

    // const countDecimals = function (value) {
    //     if (Math.floor(value) !== value)
    //         return value.toString().split(".")[1].length || 0;
    //     return 0;
    // }



    // let bal =  await hitbtcpro.fetchBalance({ 'type': 'spot' });
    // console.log(bal['USDT']);
    // let hitbtc_currencies = await hitbtcpro.fetchCurrencies();
    // let precision = hitbtc_currencies['USDT'].precision
    // console.log(precision);

    // let hitbtc_transfer = await hitbtcpro.transfer('USDT', toFixed(11.765326, countDecimals(precision)), 'wallet', 'spot');
    // console.log(hitbtc_transfer)



    const symbol = 'USDD/USDT'
    // const ticker = await huobipro.fetchTickers([symbol]);
    // const huobi_order = await huobipro.createOrder(symbol, 'market', 'sell', 8, ticker[symbol].bid);
    // console.log(huobi_order)


    // const ticker = await hitbtcpro.fetchTickers([symbol]);
    // const hitbtc_order = await hitbtcpro.createOrder(symbol, 'market', 'sell', 10, ticker[symbol].bid);
    // console.log(hitbtc_order)

    // let kk = await huobipro.fetchMyTrades(symbol);
    /*let find = false;
    let res;
    let res1;
    let lll = '691167295414235';
    while (true) {
        const trades = await huobipro.fetchMyTrades(symbol);
        for (let i = trades.length - 1; i >= 0; i--) {
            if (trades[i].order == lll) {
                res = trades[i].amount
                res1 = trades[i].cost;
                find = true;
                break;
            }
        }

        if (find === true)
            break;

    }

    console.log(res, ",", res1)

*/

}


test();
// function toFixed(num, fixed) {
//     var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
//     return num.toString().match(re)[0];
// }

// const x = 1.23456789;
// console.log(toFixed(x, 6));
