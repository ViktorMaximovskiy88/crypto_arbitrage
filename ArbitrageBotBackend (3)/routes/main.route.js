module.exports = (app) => {
    const {
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
    } = require('../controllers/main.controller');

    var router = require("express").Router();

    router.get('/huobi/currencies', _getCryptoCurrencies_huobi);
    router.get('/hitbtc/currencies', _getCryptoCurrencies_hitbtc);
    router.get('/istradingsymbol', _is_tradingSymbol);
    router.get('/huobi/trade', _trade_huobi);
    router.get('/hitbtc/trade', _trade_hitbtc);
    router.get('/hitbtc/transfer', _transfer_hitbtc);
    router.get('/hitbtc/convert', _convert_hitbtc);
    router.get('/huobi/withdraw', _withdraw_huobi);
    router.get('/hitbtc/withdraw', _withdraw_hitbtc);
    router.get('/huobi/checkwithdraw', _checkingWithdraw_huobi);
    router.get('/hitbtc/checkwithdraw', _checkingWithdraw_hitbtc);
    router.get('/huobi/balance', _getbalance_huobi);
    router.get('/hitbtc/balance', _getbalance_hitbtc);
    router.get('/matchedcoins', _getMatchedCoinNets);
    router.get('/tickdata', _getTickData);

    router.get('/balance', _balance);
    router.get('/buycoin1', _buycoin1);
    router.get('/sellcoin2', _sellcoin2);
    router.get('/withdraw_coin', _withdraw_coin);
    router.get('/conv_coins', _conv_coins);
    app.use('/api', router);
};