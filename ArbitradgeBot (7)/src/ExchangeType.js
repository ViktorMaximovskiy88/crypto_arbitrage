import React, {
    useEffect,
    useState,
    useRef,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { getTickData, is_tradingSymbol } from './RequestTrade';


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


export default function ExchangeType(props) {
    const { _setExchange, _exchange, _disabled, _setAmount, _amountVisible } = props;
    const classes = useStyles();

    const [exchanges, setExchanges] = useState([]);
    const [exchange, setExchange] = useState("");
    const [amount, setAmount] = useState(50);
    


    useEffect(() => {
        // const exchangelst = Object.keys(exchangeList).map((key) => {
        //     return { value: exchangeList[key], label: key };
        // });

        // setExchanges(exchangelst);
        setExchange(_exchange);

    }, []);

    useEffect(() => {
        _setAmount(amount);
        
    }, [amount]);

    useEffect(() => {
        setExchange(_exchange);
        setAmount(50);
    }, [_exchange]);

   
    const handleChangeExchange1 = (value) => {
        setExchange(value);
        _setExchange(value);
    }

    const onChangeAmount = (e) => {
        // console.log(e.target.value);
        setAmount(e.target.value);
    }

    return (
        <div>

            <FormControl className={classes.formControl}>
                {/* <InputLabel htmlFor="exchange1">Exchange</InputLabel> */}
                <TextField
                    label="Exchange"
                    style={{ width: 150 }}
                    disabled={_disabled}
                    // defaultValue={currencyCoin1}
                    value={exchange}
                    onChange={(e) => {
                        const newValue = e.target.value;

                        setExchange(newValue.toLocaleLowerCase());
                        _setExchange(newValue.toLocaleLowerCase());


                    }}
                    variant="outlined"

                />

                {/* <Select
                    native
                    value={exchange}
                    disabled={_disabled}
                    inputProps={{
                        id: 'exchange1',
                    }}
                    onChange={(e) => handleChangeExchange1(e.target.value)}

                >
                    {
                        exchanges.map((ex) => {
                            return (
                                <option key={ex.value} value={ex.value} > {ex.label}</option>
                            );
                        })
                    }

                </Select> */}
            </FormControl>

            {(_disabled == false) && <FormControl className={classes.formControl}>
                {_amountVisible === true && <TextField
                    label="USDT Amount"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100000000 } }}
                    value={amount}
                    onChange={onChangeAmount}
                    variant="outlined"

                />}
            </FormControl>}


        </div>
    );
}
