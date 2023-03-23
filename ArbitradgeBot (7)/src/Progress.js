import React, {
    useEffect,
    useState,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { exchangeList } from './ConstExchangeList';


const useStyles = makeStyles((theme) => ({
    root: {

        marginTop: theme.spacing(5),
        minWidth: 120,

    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps(ex1, ex2) {
    if (ex1 === exchangeList.Kucoin && ex2 === exchangeList.Kraken) {
        return ['Ready', 'Buy Coin 2 in Huobi', 'Withdraw Coin 2 in Huobi', 'Buy Coin 2 in Hitbtc', 'Withdraw Coin 2 in Hitbtc', 'Buy USDT in Huobi', 'Completed'];
    }
    else if (ex2 === exchangeList.Kucoin && ex1 === exchangeList.Kraken)
        return ['Ready', 'Buy Coin 2 in Hitbtc', 'Withdraw Coin 2 in Hitbtc', 'Buy Coin 2 in Huobi', 'Withdraw Coin 2 in Huobi', 'Buy USDT in Hitbtc', 'Completed'];

    return [];
}

export default function ExportProgress(props) {
    const classes = useStyles();

    const { _step, _ex1, _ex2 } = props;
    const [steps, setsteps] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        setActiveStep(_step);
    }, [_step]);

    useEffect(() => {
        const stp = getSteps(_ex1, _ex2);
        setsteps(stp);
    }, [_ex1, _ex2]);



    return (
        <div className={classes.root}>
            {(Object.values(exchangeList).includes(_ex1) && Object.values(exchangeList).includes(_ex2)) && <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>}

        </div>
    );
}
