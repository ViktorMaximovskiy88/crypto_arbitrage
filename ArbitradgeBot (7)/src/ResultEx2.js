import React, { useEffect, useState, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    marketOrder,
    withdraw_huobi, withdraw_hitbtc, trade_huobi, trade_hitbtc,
    convert_hitbtc, transfer_hitbtc, checkingWithdraw_huobi, checkingWithdraw_hitbtc,
    is_tradingSymbol,
    getbalance_huobi, getbalance_hitbtc,
    getTickData,
} from './RequestTrade';
import { exchangeList } from './ConstExchangeList';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },


    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(5),
        },

        display: "flex",
        alignItems: "center"

    },
}));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// _coin1_Excahnge2_1
// 2 means exchange2
// 1 means position of exchange

export default function ExportResult(props) {

    const classes = useStyles();

    const {
        _amount,
        _coin1_Excahnge2_1, _coin1Net_Excahnge2_1, _convertedCoin1Enable_Exchange2_1, _convertedCoin1_Excahnge2_1, _convertedCoin1Net_Excahnge2_1, _coin2_Excahnge2_1, _coin2Net_Excahnge2_1,
        _coin1_Excahnge1_2, _coin1Net_Excahnge1_2, _coin2_Excahnge1_2, _coin2Net_Excahnge1_2,
        _coin1_Excahnge2_3, _coin1Net_Excahnge2_3, _convertedCoin1Enable_Exchange2_3, _convertedCoin1_Excahnge2_3, _convertedCoin1Net_Excahnge2_3, _coin2_Excahnge2_3, _coin2Net_Excahnge2_3,

        _setStep,
    } = props;

    const activeStep = useRef(0);
    const withdrawAmount = useRef(0);
    const buy = useRef(0);
    const convert = useRef(0);
    const transfer = useRef(0);
    const withdrawTransID = useRef(0);

    const [inputUsdt, setInputUsdt] = useState(50);
    const [outputUsdt, setOutputUsdt] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    

    const getInitialSymbol = async () => {
        const isTradingSym_1_buy = await is_tradingSymbol(_coin1_Excahnge2_1, "USDT", 0);
        const isTradingSym_1_sell = await is_tradingSymbol("USDT", _coin1_Excahnge2_1, 0);

        // console.log(isTradingSym_1_buy, isTradingSym_1_sell)

        let symbol;
        if (isTradingSym_1_buy == true) {
            symbol = _coin1_Excahnge2_1 + "/USDT";
        }
        else if (isTradingSym_1_sell == true) {
            symbol = "USDT/" + _coin1_Excahnge2_1;
        }


        return symbol;
    }

    useEffect(() => {

        async function initialize() {


            const symbol = await getInitialSymbol();
            if (symbol !== undefined) {
                const ticker = await getTickData(exchangeList.HitBTC, symbol);
                if (ticker['result'] !== undefined) {
                    setInputUsdt(_amount / ticker['result']);
                    return;
                }
            }

            setInputUsdt(0);
        }

        if (_coin1_Excahnge2_1 !== "USDT")
            initialize();
        else
            setInputUsdt(_amount);

    }, [_coin1_Excahnge2_1, _amount]);


    useEffect(() => {
        activeStep.current = -2;
        setInputUsdt(_amount);
        _setStep(0);
    }, []);


    const Process = async (trade_1, trade_2, trade_3) => {
        let alertMsg = "Uncompleted";

        console.log(trade_1, trade_2, trade_3);


        while (true) {
            console.log(activeStep.current);

            if (activeStep.current === -2) { // buy coin2 in hitbtc
                activeStep.current = -1;

                if (_coin1_Excahnge2_1 == "USDT") {
                    const res = await transfer_hitbtc(1, "USDT", _amount);
                    console.log(res);
                    if (res['result'] === -1) {
                        console.log(res['message']);
                        alertMsg = res['message'];
                        break;
                    }
                    transfer.current = res['result'];
                    buy.current = transfer.current;
                    activeStep.current = 0;
                }
                else {
                    const isTradingSym_1_buy = await is_tradingSymbol(_coin1_Excahnge2_1, "USDT", 1);
                    const isTradingSym_1_sell = await is_tradingSymbol("USDT", _coin1_Excahnge2_1, 1);
                    const symbol = await getInitialSymbol();
                    if (symbol !== undefined) {
                        let res = await transfer_hitbtc(1, "USDT", _amount);
                        console.log(res);
                        if (res['result'] === -1) {
                            console.log(res['message']);
                            alertMsg = res['message'];
                            break;
                        }
                        transfer.current = res['result'];

                        res = await trade_hitbtc(isTradingSym_1_buy ? 1 : 0, _coin1_Excahnge2_1, "USDT", transfer.current);
                        if (res['result'] === -1) {
                            console.log(res['message']);
                            alertMsg = res['message'];
                            break;
                        }

                        buy.current = res['result'];
                        activeStep.current = 0;
                    }
                    else {
                        alertMsg = "Symbol is not correct";
                        break;
                    }
                }

            }

            if (activeStep.current === 0) { // convert and transfer coin1 in hitbtc
                activeStep.current = 1;

                if (_coin1_Excahnge2_1 !== _convertedCoin1_Excahnge2_1 && _convertedCoin1Enable_Exchange2_1 === true) {
                    const res = await convert_hitbtc(_coin1_Excahnge2_1, _coin1Net_Excahnge2_1, _convertedCoin1_Excahnge2_1, _convertedCoin1Net_Excahnge2_1, buy.current);
                    console.log(res);
                    if (res['result'] === -1) {
                        console.log(res['message']);
                        alertMsg = res['message'];
                        break;
                    }
                    convert.current = res['result'];
                }
                else {
                    convert.current = buy.current;
                }

                // const convertedCoin = _convertedCoin1Enable_Exchange2_1 === true ? _convertedCoin1_Excahnge2_1 : _coin1_Excahnge2_1;
                // const res = await transfer_hitbtc(1, convertedCoin, convert.current);
                // console.log(res);
                // if (res['result'] === -1) {
                //     console.log(res['message']);
                //     alertMsg = res['message'];
                //     break;
                // }

                // transfer.current = res['result'];
                activeStep.current = 2;
            }
            else if (activeStep.current === 2) { // buy coin2 in hitbtc
                activeStep.current = 3;
                const convertedCoin = _convertedCoin1Enable_Exchange2_1 === true ? _convertedCoin1_Excahnge2_1 : _coin1_Excahnge2_1;
                const res = await trade_hitbtc(trade_1, _coin2_Excahnge2_1, convertedCoin, convert.current);
                console.log(res);
                if (res['result'] === -1) {
                    console.log(res['message']);
                    alertMsg = res['message'];
                    break;
                }

                buy.current = res['result'];

                const transferRes = await transfer_hitbtc(0, _coin2_Excahnge2_1, buy.current);
                console.log(transferRes);
                if (transferRes['result'] === -1) {
                    console.log(transferRes['message']);
                    alertMsg = transferRes['message'];
                    break;
                }

                transfer.current = transferRes['result'];
                activeStep.current = 4;
                _setStep(1);
                
            }
            else if (activeStep.current === 4) { // withdraw coin2 request in hitbtc
                activeStep.current = 5;

                const res = await withdraw_hitbtc(_coin2_Excahnge2_1, _coin2Net_Excahnge2_1, _coin1_Excahnge1_2, _coin1Net_Excahnge1_2, transfer.current);
                console.log(res);

                if (res['result'] === -1) {
                    console.log(res['message']);
                    alertMsg = res['message'];
                    break;
                }
                withdrawTransID.current = res['result'];
                activeStep.current = 6; // withdraw commit in hitbtc
            }
            else if (activeStep.current === 6) {
                let res;

                while (true) {
                    res = await checkingWithdraw_hitbtc(_coin2_Excahnge2_1, withdrawTransID.current);
                    console.log(res);
                    if (res['result'] === -1) {
                        console.log(res['message']);
                    }
                    else {

                        break;
                    }
                    await sleep(1000);

                }

                if (res['result'] === -1 || res['result'] == undefined) {
                    break;
                }

                withdrawAmount.current = res['result'];
                activeStep.current = 7; // withdraw complete in hitbtc
                _setStep(2);


            }
            else if (activeStep.current === 7) { // buy coin2 in huobi
                activeStep.current = 8;
                const res = await trade_huobi(trade_2, _coin2_Excahnge1_2, _coin1_Excahnge1_2, withdrawAmount.current);
                console.log(res);
                if (res['result'] === -1) {
                    console.log(res['message']);
                    alertMsg = res['message'];
                    break;
                }

                buy.current = res['result'];
                activeStep.current = 9;
                _setStep(3);
            }
            else if (activeStep.current === 9) { // withdraw coin2 request in huobi
                activeStep.current = 10;
                const res = await withdraw_huobi(_coin2_Excahnge1_2, _coin2Net_Excahnge1_2, _coin1_Excahnge2_3, _coin1Net_Excahnge2_3, buy.current);
                console.log(res);
                if (res['result'] === -1) {
                    console.log(res['message']);
                    alertMsg = res['message'];
                    break;
                }

                withdrawTransID.current = res['result'];
                activeStep.current = 11; // withdraw commit in huobi
            }
            else if (activeStep.current === 11) {
                let res;
                while (true) {
                    res = await checkingWithdraw_huobi(_coin2_Excahnge1_2, withdrawTransID);
                    console.log(res);
                    if (res['result'] === -1) {
                        console.log(res['message']);
                    }
                    else {

                        break;
                    }
                    await sleep(1000);

                }

                if (res['result'] === -1 || res['result'] == undefined) {
                    break;
                }

                withdrawAmount.current = res['result'];
                activeStep.current = 12; // withdraw complete in huobi
                _setStep(4);

            }
            else if (activeStep.current === 12) { // convert and tranfer coin1 in hitbtc
                activeStep.current = 13;

                if (_coin1_Excahnge2_3 !== _convertedCoin1_Excahnge2_3 && _convertedCoin1Enable_Exchange2_3 === true) {
                    const res = await convert_hitbtc(_coin1_Excahnge2_3, _coin1Net_Excahnge2_3, _convertedCoin1_Excahnge2_3, _convertedCoin1Net_Excahnge2_3, withdrawAmount.current);
                    console.log(res);
                    if (res['result'] === -1) {
                        console.log(res['message']);
                        alertMsg = res['message'];
                        break;
                    }
                    convert.current = res['result'];
                }
                else {
                    convert.current = withdrawAmount.current;

                }

                const convertedCoin = _convertedCoin1Enable_Exchange2_3 === true ? _convertedCoin1_Excahnge2_3 : _coin1_Excahnge2_3;
                const res = await transfer_hitbtc(1, convertedCoin, convert.current);
                console.log(res);
                if (res['result'] === -1) {
                    console.log(res['message']);
                    alertMsg = res['message'];
                    break;
                }

                transfer.current = res['result'];
                activeStep.current = 14;
            }

            else if (activeStep.current === 14) { // buy coin2 in hitbtc
                activeStep.current = 15;

                const convertedCoin = _convertedCoin1Enable_Exchange2_3 === true ? _convertedCoin1_Excahnge2_3 : _coin1_Excahnge2_3;
                const res = await trade_hitbtc(trade_3, _coin2_Excahnge2_3, convertedCoin, transfer.current);
                console.log(res);
                if (res['result'] === -1) {
                    console.log(res['message']);
                    alertMsg = res['message'];
                    break;
                }

                buy.current = res['result'];

                // const transferRes = await transfer_hitbtc(0, _coin2_Excahnge2_3, buy.current);
                // console.log(transferRes);
                // if (transferRes['result'] === -1) {
                //     console.log(transferRes['message']);
                //     alertMsg = transferRes['message'];
                //     break;
                // }

                // transfer.current = transferRes['result'];

                // console.log(_coin2_Excahnge2_3, _coin2Net_Excahnge2_3, _coin1_Excahnge2_1, _coin1Net_Excahnge2_1, transfer.current);

                // if (_coin1_Excahnge2_1 !== _coin2_Excahnge2_3) {
                //     const res = await convert_hitbtc(_coin2_Excahnge2_3, _coin2Net_Excahnge2_3, _coin1_Excahnge2_1, _coin1Net_Excahnge2_1, transfer.current, 1);
                //     console.log(res);
                //     if (res['result'] === -1) {
                //         console.log(res['message']);
                //         alertMsg = res['message'];
                //         break;
                //     }

                //     convert.current = res['result'];
                // }
                // else {
                //     convert.current = transfer.current;
                // }



                activeStep.current = 16;
                _setStep(5);
            }


            else if (activeStep.current === 16) {
                await sleep(1000);

                activeStep.current = 17; // complete
                _setStep(6);
                setOutputUsdt(buy.current);

                // const bal = await getbalance_hitbtc(_coin1_Excahnge2_1);

                // if (bal !== undefined && bal.free !== undefined) {
                //     const outMoney = bal.free;
                //     setOutputUsdt(outMoney- previousBalance);
                // }

                break;
            }
        }

        if (activeStep.current === 17) {
            alertMsg = "Completed";
        }

        return alertMsg;
    }

    const clickStart = async () => {

        if (_amount <= 0) {
            alert(`Amount must be less than 0 in HitBTC.`);
            return;
        }

        // console.log(_coin1_Excahnge2_1, ", ", _coin1Net_Excahnge2_1, ",", _convertedCoin1_Excahnge2_1, ",", _convertedCoin1Net_Excahnge2_1, ",", _coin2_Excahnge2_1, ",", _coin2Net_Excahnge2_1);
        // console.log(_coin1_Excahnge1_2, ", ", _coin1Net_Excahnge1_2, ", ", _coin2_Excahnge1_2, ",", _coin2Net_Excahnge1_2);
        // console.log(_coin1_Excahnge2_3, ", ", _coin1Net_Excahnge2_3, ",", _convertedCoin1_Excahnge2_3, ",", _convertedCoin1Net_Excahnge2_3, ",", _coin2_Excahnge2_3, ",", _coin2Net_Excahnge2_3);


        const coin1 = _convertedCoin1Enable_Exchange2_1 === true ? _convertedCoin1_Excahnge2_1 : _coin1_Excahnge2_1;
        let isTradingSym_1_buy = await is_tradingSymbol(_coin2_Excahnge2_1, coin1, 1);
        let isTradingSym_1_sell = await is_tradingSymbol(coin1, _coin2_Excahnge2_1, 1);


        let isTradingSym_2_buy = await is_tradingSymbol(_coin2_Excahnge1_2, _coin1_Excahnge1_2, 0);
        let isTradingSym_2_sell = await is_tradingSymbol(_coin1_Excahnge1_2, _coin2_Excahnge1_2, 0);

        const coin3 = _convertedCoin1Enable_Exchange2_3 === true ? _convertedCoin1_Excahnge2_3 : _coin1_Excahnge2_3;
        let isTradingSym_3_buy = await is_tradingSymbol(_coin2_Excahnge2_3, coin3, 1);
        let isTradingSym_3_sell = await is_tradingSymbol(coin3, _coin2_Excahnge2_3, 1);

        let trade_1 = -1;
        if (isTradingSym_1_buy == true) {
            trade_1 = marketOrder.Buy;
        }
        else if (isTradingSym_1_sell == true) {
            trade_1 = marketOrder.Sell;
        }

        let trade_2 = -1;
        if (isTradingSym_2_buy == true) {
            trade_2 = marketOrder.Buy;
        }
        else if (isTradingSym_2_sell == true) {
            trade_2 = marketOrder.Sell;
        }

        let trade_3 = -1;
        if (isTradingSym_3_buy == true) {
            trade_3 = marketOrder.Buy;
        }
        else if (isTradingSym_3_sell == true) {
            trade_3 = marketOrder.Sell;
        }



        if (trade_1 === -1) {
            alert(`${coin1} and ${_coin2_Excahnge2_1} is not trading symbol at first part of exchange(huobi).`);
            return;
        }

        if (trade_2 === -1) {
            alert(`${_coin1_Excahnge1_2} and ${_coin2_Excahnge1_2} is not trading symbol at exchange(hitbtc).`);
            return;
        }

        if (trade_3 === -1) {
            alert(`${coin3} and ${_coin2_Excahnge2_3} is not trading symbol at third part of exchange(huobi).`);
            return;
        }

        
        activeStep.current = -2;
        _setStep(0);
        setIsLoading(true);
        const message = await Process(trade_1, trade_2, trade_3);
        setIsLoading(false);
        alert(message);
    }

    return (
        <div className={classes.root}>
            <div>
                <TableContainer component={Paper} style={{ width: 800 }}>
                    <Table className={classes.table} aria-label="customized table">
                        {/* <TableHead>
                            <TableRow>
                                <StyledTableCell>Exchange</StyledTableCell>
                                <StyledTableCell>Input (Usdt)</StyledTableCell>
                                <StyledTableCell>Output (Usdt)</StyledTableCell>
                            </TableRow>
                        </TableHead> */}
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    Exchange: HitBTC
                                </StyledTableCell>
                                <StyledTableCell>Coin 1 Balance before start Bot : {inputUsdt}</StyledTableCell>
                                <StyledTableCell>Coin 1 Balance after end Bot : {outputUsdt}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div >
                <Button variant="contained" color="primary" onClick={() => clickStart()}>
                    Start Loop Arbitrage
                </Button>
            </div>

            <div >
                {isLoading && <CircularProgress />}
            </div>


        </div >

    );
}
