import React, {
    useEffect,
    useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getCryptoCurrencies_hitbtc, _is_tradingSymbol } from './RequestTrade';

const useStyles = makeStyles((theme) => ({
    formControl2: {
        margin: 0,
        minWidth: 120,
        width: 120,
    },
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
    const { _position, _matchedCoins, _setCurrencyCoin1, _setNetworkCoin1, _setCurrencyCoin2Enable, _setCurrencyCoin2, _setNetworkCoin2, _setCurrencyCoin3, _setNetworkCoin3, _matchedCoin_Ex2, _matchedCoinNet_Ex2, _setMatchedCoin_Ex1, _setMatchedCoinNet_Ex1 } = props;
    const classes = useStyles();

    const [resmap, setResMap] = useState([]);

    const [currenciesCoin, setCurrenciesCoin] = useState([]);
    const [currencyCoin1, setCurrencyCoin1] = useState("");
    const [currencyCoin2, setCurrencyCoin2] = useState("");
    const [currencyCoin3, setCurrencyCoin3] = useState("");

    const [networksCoin1, setNetworksCoin1] = useState([]);
    const [networksCoin2, setNetworksCoin2] = useState([]);
    const [networksCoin3, setNetworksCoin3] = useState([]);
    const [networkCoin1, setNetworkCoin1] = useState("");
    const [networkCoin2, setNetworkCoin2] = useState("");
    const [networkCoin3, setNetworkCoin3] = useState("");

    const [withdrawfee, setWithdrawfee] = useState(0);

    const [currencyCoin2Enable, setCurrencyCoin2Enable] = useState(true);


    const getMap = async (value) => {

        const result = await getCryptoCurrencies_hitbtc();
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
            SetNetwork2(result, networks2[0]);
        }
        else {
            setNetworksCoin2([]);
            SetNetwork2(result, "");
        }

    }

    const SetCoin3 = (result, coin3) => {


        setCurrencyCoin3(coin3);

        const value3 = result.get(coin3);
        if (value3 !== undefined) {
            const networks3 = Object.keys(value3);
            setNetworksCoin3(networks3);

            SetNetwork3(result, coin3, networks3[0]);

        }
        else {
            setNetworksCoin3([]);
            SetNetwork3(result, coin3, "");
        }
    }


    const SetNetwork1 = (result, net1) => {
        setNetworkCoin1(net1);
    }

    const SetNetwork2 = (result, net2) => {
        setNetworkCoin2(net2);
    }


    const SetNetwork3 = (result, coin3, net3) => {
        setNetworkCoin3(net3);
        const value = result.get(coin3);
        if (net3 === "")
            setWithdrawfee(0);
        else
            setWithdrawfee(value[net3].fee);
    }

    useEffect(() => {
        async function initialize() {
            const result = await getMap();
            setResMap(result);


            const currencies = Array.from(result.keys()).sort();
            setCurrenciesCoin(currencies);

            if (_position === 0) {
                SetCoin1(result, "USDT");
                SetCoin2(result, "USDT");
                SetCoin3(result, "USDT");
            }
            else if (_position === 1) {
                SetCoin1(result, "USDT");
                SetCoin2(result, "USDT");
                SetCoin3(result, "USDT");
            }
            else {
                SetCoin1(result, "USDT");
                SetCoin2(result, "USDT");
                SetCoin3(result, "USDT");

            }


        }
        initialize();

    }, [_position]);

    useEffect(() => {
        _setCurrencyCoin1(currencyCoin1);
        _setNetworkCoin1(networkCoin1);
        _setCurrencyCoin2(currencyCoin2);
        _setNetworkCoin2(networkCoin2);
        _setCurrencyCoin3(currencyCoin3);
        _setNetworkCoin3(networkCoin3);
        _setCurrencyCoin2Enable(currencyCoin2Enable);

    }, [currencyCoin1, networkCoin1, currencyCoin2, networkCoin2, currencyCoin3, networkCoin3, currencyCoin2Enable]);

    useEffect(() => {
        // console.log(_matchedCoin_Ex2)
        // console.log(resmap)

        if (resmap.size > 0) {

            const exist = resmap.get(_matchedCoin_Ex2)
            // console.log(exist) ;
            if (exist !== undefined) {
                if (_matchedCoin_Ex2 !== undefined && _matchedCoin_Ex2 !== 0) {
                    SetCoin1(resmap, _matchedCoin_Ex2);
                    setNetworkCoin1(_matchedCoinNet_Ex2);
                }
            }
        }



    }, [_matchedCoin_Ex2]);

    return (
        <div>
            <div style={{ marginLeft: 180 }}>
                <FormControlLabel className={classes.formControl2}
                    control={
                        <Checkbox
                            checked={currencyCoin2Enable}
                            onChange={(event) => {
                                const checked = event.target.checked;
                                setCurrencyCoin2Enable(checked);
                            }}
                            name="checkedB"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                            color="primary"
                        />
                    }
                    label="Convert"
                />

            </div>


            <div style={{ display: 'flex' }}>
                <div>
                    {<FormControl className={classes.formControl}>
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
                    </FormControl>}
                    <br />
                    <FormControl className={classes.formControlBelow}>
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
                    </FormControl>
                </div>



                <div >

                    <FormControl className={classes.formControl}>
                        <TextField
                            label="Conv Coin 1"
                            style={{ width: 150 }}
                            // defaultValue={currencyCoin1}
                            disabled={!currencyCoin2Enable}
                            value={currencyCoin2}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                SetCoin2(resmap, newValue);

                            }}
                            variant="outlined"

                        />

                        {/* <Autocomplete
                            disableClearable={true}
                            value={currencyCoin2}
                            disabled={!currencyCoin2Enable}
                            onChange={async (event, newValue) => {
                                SetCoin2(resmap, newValue);

                            }}
                            className="mb-0 "
                            style={{ width: 150 }}
                            options={currenciesCoin}

                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Conv Coin 1"
                                    variant="outlined"
                                    size='small'
                                />
                            )}
                        /> */}

                    </FormControl>
                    <br />
                    <FormControl className={classes.formControlBelow}>
                        <Autocomplete
                            disableClearable={true}
                            value={networkCoin2}
                            disabled={!currencyCoin2Enable}
                            onChange={async (event, newValue) => {
                                SetNetwork2(resmap, newValue);

                            }}
                            className="mb-0 "
                            style={{ width: 150 }}
                            options={networksCoin2}

                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Conv Coin1 Net"
                                    variant="outlined"
                                    size='small'
                                />
                            )}
                        />
                    </FormControl>

                </div>


                <div >
                    {_position !== 2 && <FormControl className={classes.formControl}>
                        <TextField
                            label="Coin 2"
                            style={{ width: 150 }}
                            // defaultValue={currencyCoin1}
                            value={currencyCoin3}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                SetCoin3(resmap, newValue);

                                const net = _matchedCoins[newValue];
                                if (net !== undefined) {
                                    SetNetwork3(resmap, newValue, net);
                                    _setMatchedCoin_Ex1(newValue);
                                    _setMatchedCoinNet_Ex1(net);
                                }
                            }}
                            variant="outlined"

                        />

                        {/* <Autocomplete
                            disableClearable={true}
                            value={currencyCoin3}
                            // disabled={_position === 2 ? true : false}
                            onChange={async (event, newValue) => {
                                SetCoin3(resmap, newValue);

                                const net = _matchedCoins[newValue];
                                if (net !== undefined) {
                                    SetNetwork3(resmap, newValue, net);
                                    _setMatchedCoin_Ex1(newValue);
                                    _setMatchedCoinNet_Ex1(net);
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
                    {_position !== 2 && <FormControl className={classes.formControlBelow}>
                        <Autocomplete
                            disableClearable={true}
                            value={networkCoin3}
                            onChange={async (event, newValue) => {
                                SetNetwork3(resmap, currencyCoin3, newValue);

                            }}
                            className="mb-0 "
                            style={{ width: 150 }}
                            options={networksCoin3}

                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Coin 2 Net"
                                    variant="outlined"
                                    size='small'
                                />
                            )}
                        />
                    </FormControl>}
                    <br />
                    {_position !== 2 && <FormControl className={classes.formControlTxt}>
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
        </div>
    );
}
