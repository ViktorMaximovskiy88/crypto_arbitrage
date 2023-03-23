import React, {
    useEffect,
    useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab'

import { getCryptoCurrencies_huobi, is_tradingSymbol, _is_tradingSymbol, _getMatchedCoinNets } from './RequestTrade';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(3),
        minWidth: 120,
        width: 120,
    },
    formControlBelow: {
        marginLeft: theme.spacing(3),
        marginTop: 0,
        minWidth: 120,
        width: 120,
    },

    formControlTxt: {
        marginLeft: theme.spacing(3),
        marginTop: 20,
        minWidth: 120,
        width: 150,
    },

    selectEmpty: {
        marginTop: theme.spacing(5),
    },
}));


export default function ExportExchange1(props) {
    const { _position, _matchedCoins, _setCurrencyCoin1, _setNetworkCoin1, _setCurrencyCoin2, _setNetworkCoin2, _matchedCoin_Ex1, _matchedCoinNet_Ex1, _setMatchedCoin_Ex2, _setMatchedCoinNet_Ex2 } = props;
    const classes = useStyles();

    const [resmap, setResMap] = useState([]);

    const [currenciesCoin, setCurrenciesCoin] = useState([]);
    const [currencyCoin1, setCurrencyCoin1] = useState("");
    const [currencyCoin2, setCurrencyCoin2] = useState("");

    const [networksCoin1, setNetworksCoin1] = useState([]);
    const [networksCoin2, setNetworksCoin2] = useState([]);
    const [networkCoin1, setNetworkCoin1] = useState("");
    const [networkCoin2, setNetworkCoin2] = useState("");

    const [withdrawfee, setWithdrawfee] = useState(0);



    const getMap = async (value) => {

        const result = await getCryptoCurrencies_huobi();
        let resMap = new Map();
        Object.keys(result).map((key) => {
            // console.log(result[key].code)
            resMap.set(result[key].code, result[key].networks);

        });


        return resMap;


    };

    const SetCoin1 = (result, coin1) => {

        setCurrencyCoin1(coin1);

        const value1 = result.get(coin1);
        if (value1 !== undefined) {
            const networks1 = Object.keys(value1);
            setNetworksCoin1(networks1);

            SetNetwork1(result, networks1[0]);
        }
        else {
            setNetworksCoin1([]);
            SetNetwork1(result, "");
        }

    }

    const SetCoin2 = (result, coin2) => {

        setCurrencyCoin2(coin2);
        const value2 = result.get(coin2);

        if (value2 !== undefined) {
            const networks2 = Object.keys(value2);
            setNetworksCoin2(networks2);

            SetNetwork2(result, coin2, networks2[0]);
        }
        else {

        }

    }


    const SetNetwork1 = (result, net1) => {
        setNetworkCoin1(net1);
    }


    const SetNetwork2 = (result, coin2, net2) => {

        setNetworkCoin2(net2);
        const value = result.get(coin2);

        if (net2 === "")
            setWithdrawfee(0);
        else
            setWithdrawfee(value[net2].fee);
    }


    useEffect(() => {
        async function initialize() {
            const result = await getMap();
            setResMap(result);

            const currencies = Array.from(result.keys()).sort();
            setCurrenciesCoin(currencies);
            if (_position === 0) {
                // console.log(result)
                SetCoin1(result, "USDT");
                SetCoin2(result, "USDT");
                // SetNetwork2(result, "USDD", "TRC20");

            }
            else if (_position === 1) {

                SetCoin1(result, "USDT");
                // SetNetwork1(result, "TRC20");
                SetCoin2(result, "USDT");
                // SetNetwork2(result, "TRX", "TRX");
            }
            else {
                SetCoin1(result, "USDT");
                // SetNetwork1(result, "TRX");
                SetCoin2(result, "USDT");

            }


        }
        initialize();

    }, [_position]);

    useEffect(() => {
        _setCurrencyCoin1(currencyCoin1);
        _setNetworkCoin1(networkCoin1);
        _setCurrencyCoin2(currencyCoin2);
        _setNetworkCoin2(networkCoin2);

    }, [currencyCoin1, networkCoin1, currencyCoin2, networkCoin2]);

    useEffect(() => {

        if (resmap.size > 0) {

            const exist = resmap.get(_matchedCoin_Ex1);
            // console.log(exist) ;
            if (exist !== undefined) {
                if (_matchedCoin_Ex1 !== undefined && _matchedCoin_Ex1 !== 0) {
                    SetCoin1(resmap, _matchedCoin_Ex1);
                    setNetworkCoin1(_matchedCoinNet_Ex1);
                }
            }
        }



    }, [_matchedCoin_Ex1]);


    return (

        <div style={{ display: 'flex', marginTop: 40 }}>
            <div>
                <FormControl className={classes.formControl}>
                    <TextField
                        label="Coin 1"
                        style={{ width: 150 }}
                        // defaultValue={currencyCoin1}
                        value={currencyCoin1}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            SetCoin1(resmap, newValue);
                        }}
                        variant="outlined"

                    />

                    {/* <Autocomplete
                        disableClearable={true}
                        value={currencyCoin1}
                        onChange={(event, newValue) => {
                            SetCoin1(resmap, newValue);


                        }}
                        className="mb-0 "
                        style={{ width: 150 }}
                        options={currenciesCoin}
                        // disabled={_position === 0 ? true : false}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Coin 1"
                                variant="outlined"
                                size='small'
                            />
                        )}
                    /> */}
                </FormControl>
                <br />
                {(_position === 1 || _position === 2) && <FormControl className={classes.formControlBelow}>
                    <Autocomplete
                        disableClearable={true}
                        value={networkCoin1}

                        onChange={async (event, newValue) => {
                            SetNetwork1(resmap, newValue);

                        }}
                        className="mb-0 "
                        style={{ width: 150 }}
                        options={networksCoin1}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Coin 1 Net"
                                variant="outlined"
                                size='small'

                            />
                        )}
                    />
                </FormControl>}
            </div>



            <div >
                {(_position === 0 || _position === 1) && <FormControl className={classes.formControl}>
                    <TextField
                        label="Coin 2"
                        style={{ width: 150 }}
                        // defaultValue={currencyCoin1}
                        value={currencyCoin2}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            SetCoin2(resmap, newValue);

                            const net = _matchedCoins[newValue];

                            if (net !== undefined) {
                                SetNetwork2(resmap, newValue, net);
                                _setMatchedCoin_Ex2(newValue);
                                _setMatchedCoinNet_Ex2(net);


                            }

                        }}
                        variant="outlined"

                    />

                    {/* <Autocomplete
                        disableClearable={true}
                        value={currencyCoin2}
                        // disabled={_position === 2 ? true : false}
                        onChange={async (event, newValue) => {

                            SetCoin2(resmap, newValue);

                            const net = _matchedCoins[newValue];

                            if (net !== undefined) {
                                SetNetwork2(resmap, newValue, net);
                                _setMatchedCoin_Ex2(newValue);
                                _setMatchedCoinNet_Ex2(net);


                            }

                        }}
                        className="mb-0 "
                        style={{ width: 150 }}
                        options={currenciesCoin}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Coin 2"
                                variant="outlined"
                                size='small'
                            />
                        )}
                    /> */}

                </FormControl>}
                <br />
                {(_position === 0 || _position === 1) && <FormControl className={classes.formControlBelow}>
                    <Autocomplete
                        disableClearable={true}
                        value={networkCoin2}
                        onChange={async (event, newValue) => {
                            SetNetwork2(resmap, currencyCoin2, newValue);

                        }}
                        className="mb-0 "
                        style={{ width: 150 }}
                        options={networksCoin2}


                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Coin 2 Net"
                                variant="outlined"

                            />
                        )}
                    />
                </FormControl>}
                <br />

                {(_position === 0 || _position === 1) && <FormControl className={classes.formControlTxt}>
                    <TextField
                        // id="withdrawfee"
                        label="Withdraw fee"
                        disabled={true}
                        value={withdrawfee}
                        variant="outlined"
                    />
                </FormControl>}

            </div>

        </div >
    );
}
