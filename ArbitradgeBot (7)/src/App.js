import './App.css';
import React, {
  useEffect,
  useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ExchangeType1 from './ExchangeType';
import ExchangeType2 from './ExchangeType';
import ExchangeType3 from './ExchangeType';

import ExportExchange1 from './Exchange1';
import ExportExchange2 from './Exchange2';
import ExportProgress from './Progress';
import ExportResult1 from './ResultEx1';
import ExportResult2 from './ResultEx2';
import { getMatchedCoinNets } from './RequestTrade';
import { exchangeList } from './ConstExchangeList';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
    minWidth: 120,
    width: 120,
  },
  formControl1: {
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

function App() {

  const [exchange1, setExchange1] = useState("kucoin");
  const [exchange2, setExchange2] = useState("kraken");
  const [amount, setAmount] = useState(0);

  // exchange 1
  const [currencyCoin1_Exchange1_0, setCurrencyCoin1_Exchange1_0] = useState(0);
  const [networkCoin1_Exchange1_0, setNetworkCoin1_Exchange1_0] = useState(0);
  const [currencyCoin2_Exchange1_0, setCurrencyCoin2_Exchange1_0] = useState(0);
  const [networkCoin2_Exchange1_0, setNetworkCoin2_Exchange1_0] = useState(0);


  const [currencyCoin1_Exchange2_1, setCurrencyCoin1_Exchange2_1] = useState(0);
  const [networkCoin1_Exchange2_1, setNetworkCoin1_Exchange2_1] = useState(0);
  const [currencyCoin2Enable_Exchange2_1, setCurrencyCoin2Enable_Exchange2_1] = useState(0);
  const [currencyCoin2_Exchange2_1, setCurrencyCoin2_Exchange2_1] = useState(0);
  const [networkCoin2_Exchange2_1, setNetworkCoin2_Exchange2_1] = useState(0);
  const [currencyCoin3_Exchange2_1, setCurrencyCoin3_Exchange2_1] = useState(0);
  const [networkCoin3_Exchange2_1, setNetworkCoin3_Exchange2_1] = useState(0);

  const [currencyCoin1_Exchange1_2, setCurrencyCoin1_Exchange1_2] = useState(0);
  const [networkCoin1_Exchange1_2, setNetworkCoin1_Exchange1_2] = useState(0);
  const [currencyCoin2_Exchange1_2, setCurrencyCoin2_Exchange1_2] = useState(0);
  const [networkCoin2_Exchange1_2, setNetworkCoin2_Exchange1_2] = useState(0);

  // exchange 2
  const [currencyCoin1_Exchange2_0, setCurrencyCoin1_Exchange2_0] = useState(0);
  const [networkCoin1_Exchange2_0, setNetworkCoin1_Exchange2_0] = useState(0);
  const [currencyCoin2Enable_Exchange2_0, setCurrencyCoin2Enable_Exchange2_0] = useState(0);
  const [currencyCoin2_Exchange2_0, setCurrencyCoin2_Exchange2_0] = useState(0);
  const [networkCoin2_Exchange2_0, setNetworkCoin2_Exchange2_0] = useState(0);
  const [currencyCoin3_Exchange2_0, setCurrencyCoin3_Exchange2_0] = useState(0);
  const [networkCoin3_Exchange2_0, setNetworkCoin3_Exchange2_0] = useState(0);

  const [currencyCoin1_Exchange1_1, setCurrencyCoin1_Exchange1_1] = useState(0);
  const [networkCoin1_Exchange1_1, setNetworkCoin1_Exchange1_1] = useState(0);
  const [currencyCoin2_Exchange1_1, setCurrencyCoin2_Exchange1_1] = useState(0);
  const [networkCoin2_Exchange1_1, setNetworkCoin2_Exchange1_1] = useState(0);

  const [currencyCoin1_Exchange2_2, setCurrencyCoin1_Exchange2_2] = useState(0);
  const [networkCoin1_Exchange2_2, setNetworkCoin1_Exchange2_2] = useState(0);
  const [currencyCoin2Enable_Exchange2_2, setCurrencyCoin2Enable_Exchange2_2] = useState(0);
  const [currencyCoin2_Exchange2_2, setCurrencyCoin2_Exchange2_2] = useState(0);
  const [networkCoin2_Exchange2_2, setNetworkCoin2_Exchange2_2] = useState(0);
  const [currencyCoin3_Exchange2_2, setCurrencyCoin3_Exchange2_2] = useState(0);
  const [networkCoin3_Exchange2_2, setNetworkCoin3_Exchange2_2] = useState(0);

  const [matchedCoin_0, setMatchedCoin_0] = useState(0);
  const [matchedCoinNet_0, setMatchedCoinNet_0] = useState(0);

  const [matchedCoin_1, setMatchedCoin_1] = useState(0);
  const [matchedCoinNet_1, setMatchedCoinNet_1] = useState(0);


  const [step, setStep] = useState(0);
  const [matchedCoins, setMatchedCoins] = useState([]);


  useEffect(() => {
    async function initialize() {
      const result = await getMatchedCoinNets();
      setMatchedCoins(result);
    }
    initialize();


  }, []);

  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: 30 }}>
          <div>
            <ExchangeType1 _setExchange={setExchange1} _exchange={exchangeList.Kucoin} _disabled={false} _setAmount={setAmount} _amountVisible={true} />
            {exchange1 === exchangeList.Kucoin && <ExportExchange1 _position={0} _matchedCoins={matchedCoins}
              _setCurrencyCoin1={setCurrencyCoin1_Exchange1_0} _setNetworkCoin1={setNetworkCoin1_Exchange1_0}
              _setCurrencyCoin2={setCurrencyCoin2_Exchange1_0} _setNetworkCoin2={setNetworkCoin2_Exchange1_0}
              // _matchedCoin_Ex1={0} _matchedCoinNet_Ex1={0}
              _setMatchedCoin_Ex2={setMatchedCoin_0} _setMatchedCoinNet_Ex2={setMatchedCoinNet_0} />}

            {exchange1 === exchangeList.Kraken && <ExportExchange2 _position={0} _matchedCoins={matchedCoins}
              _setCurrencyCoin1={setCurrencyCoin1_Exchange2_0} _setNetworkCoin1={setNetworkCoin1_Exchange2_0}
              _setCurrencyCoin2Enable={setCurrencyCoin2Enable_Exchange2_0} _setCurrencyCoin2={setCurrencyCoin2_Exchange2_0} _setNetworkCoin2={setNetworkCoin2_Exchange2_0}
              _setCurrencyCoin3={setCurrencyCoin3_Exchange2_0} _setNetworkCoin3={setNetworkCoin3_Exchange2_0}
              _setMatchedCoin_Ex1={setMatchedCoin_0} _setMatchedCoinNet_Ex1={setMatchedCoinNet_0} />}

          </div>

          <div>
            <dir _setExchange={setExchange2} _exchange={exchangeList.Kraken}  _disabled={false} _setAmount={setAmount} _amountVisible={false} />
            {exchange2 === exchangeList.Kraken && <ExportExchange2 _position={1} _matchedCoins={matchedCoins}
              _setCurrencyCoin1={setCurrencyCoin1_Exchange2_1} _setNetworkCoin1={setNetworkCoin1_Exchange2_1}
              _setCurrencyCoin2Enable={setCurrencyCoin2Enable_Exchange2_1} _setCurrencyCoin2={setCurrencyCoin2_Exchange2_1} _setNetworkCoin2={setNetworkCoin2_Exchange2_1}
              _setCurrencyCoin3={setCurrencyCoin3_Exchange2_1} _setNetworkCoin3={setNetworkCoin3_Exchange2_1}
              _matchedCoin_Ex2={matchedCoin_0} _matchedCoinNet_Ex2={matchedCoinNet_0}
              _setMatchedCoin_Ex1={setMatchedCoin_1} _setMatchedCoinNet_Ex1={setMatchedCoinNet_1} />}

            {exchange2 === exchangeList.Kucoin && <ExportExchange1 _position={1} _matchedCoins={matchedCoins} _setCurrencyCoin1={setCurrencyCoin1_Exchange1_1} _setNetworkCoin1={setNetworkCoin1_Exchange1_1} _setCurrencyCoin2={setCurrencyCoin2_Exchange1_1} _setNetworkCoin2={setNetworkCoin2_Exchange1_1}
              _matchedCoin_Ex1={matchedCoin_0} _matchedCoinNet_Ex1={matchedCoinNet_0}
              _setMatchedCoin_Ex2={setMatchedCoin_1} _setMatchedCoinNet_Ex2={setMatchedCoinNet_1} />}

          </div>

          <div>
            <ExchangeType3 _setExchange={""} _exchange={exchange1}  _disabled={true} _setAmount={setAmount} _amountVisible={false} />
            {exchange1 === exchangeList.Kucoin && <ExportExchange1 _position={2} _matchedCoins={matchedCoins}
              _setCurrencyCoin1={setCurrencyCoin1_Exchange1_2} _setNetworkCoin1={setNetworkCoin1_Exchange1_2}
              _setCurrencyCoin2={setCurrencyCoin2_Exchange1_2} _setNetworkCoin2={setNetworkCoin2_Exchange1_2}
              _matchedCoin_Ex1={matchedCoin_1} _matchedCoinNet_Ex1={matchedCoinNet_1}
            />}

            {exchange1 === exchangeList.Kraken && <ExportExchange2 _position={2} _matchedCoins={matchedCoins}
              _setCurrencyCoin1={setCurrencyCoin1_Exchange2_2} _setNetworkCoin1={setNetworkCoin1_Exchange2_2}
              _setCurrencyCoin2Enable={setCurrencyCoin2Enable_Exchange2_2} _setCurrencyCoin2={setCurrencyCoin2_Exchange2_2} _setNetworkCoin2={setNetworkCoin2_Exchange2_2}
              _setCurrencyCoin3={setCurrencyCoin3_Exchange2_2} _setNetworkCoin3={setNetworkCoin3_Exchange2_2}
              _matchedCoin_Ex2={matchedCoin_1} _matchedCoinNet_Ex2={matchedCoinNet_1}
            />}


          </div>

        </div>
      </div>

      <ExportProgress _step={step} _ex1={exchange1} _ex2={exchange2} />

      {(exchange1 === exchangeList.Kucoin && exchange2 === exchangeList.Kraken) && <ExportResult1
        _amount={amount}
        _coin1_Excahnge1_1={currencyCoin1_Exchange1_0} _coin1Net_Excahnge1_1={networkCoin1_Exchange1_0} _coin2_Excahnge1_1={currencyCoin2_Exchange1_0} _coin2Net_Excahnge1_1={networkCoin2_Exchange1_0}
        _coin1_Excahnge2_2={currencyCoin1_Exchange2_1} _coin1Net_Excahnge2_2={networkCoin1_Exchange2_1} _convertEnableCoin1={currencyCoin2Enable_Exchange2_1} _convertedCoin1Enable_Exchange2_2={currencyCoin2Enable_Exchange2_1} _convertedCoin1_Excahnge2_2={currencyCoin2_Exchange2_1} _convertedCoin1Net_Excahnge2_2={networkCoin2_Exchange2_1} _coin2_Excahnge2_2={currencyCoin3_Exchange2_1} _coin2Net_Excahnge2_2={networkCoin3_Exchange2_1}
        _coin1_Excahnge1_3={currencyCoin1_Exchange1_2} _coin1Net_Excahnge1_3={networkCoin1_Exchange1_2} _coin2_Excahnge1_3={currencyCoin1_Exchange1_0} _coin2Net_Excahnge1_3={networkCoin1_Exchange1_0}
        _setStep={setStep} />}

      {(exchange1 === exchangeList.Kraken && exchange2 === exchangeList.Kucoin) && <ExportResult2
        _amount={amount}
        _coin1_Excahnge2_1={currencyCoin1_Exchange2_0} _coin1Net_Excahnge2_1={networkCoin1_Exchange2_0} _convertedCoin1Enable_Exchange2_1={currencyCoin2Enable_Exchange2_0} _convertedCoin1_Excahnge2_1={currencyCoin2_Exchange2_0} _convertedCoin1Net_Excahnge2_1={networkCoin2_Exchange2_0} _coin2_Excahnge2_1={currencyCoin3_Exchange2_0} _coin2Net_Excahnge2_1={networkCoin3_Exchange2_0}
        _coin1_Excahnge1_2={currencyCoin1_Exchange1_1} _coin1Net_Excahnge1_2={networkCoin1_Exchange1_1} _coin2_Excahnge1_2={currencyCoin2_Exchange1_1} _coin2Net_Excahnge1_2={networkCoin2_Exchange1_1}
        _coin1_Excahnge2_3={currencyCoin1_Exchange2_2} _coin1Net_Excahnge2_3={networkCoin1_Exchange2_2} _convertedCoin1Enable_Exchange2_3={currencyCoin2Enable_Exchange2_2} _convertedCoin1_Excahnge2_3={currencyCoin2_Exchange2_2} _convertedCoin1Net_Excahnge2_3={networkCoin2_Exchange2_2} _coin2_Excahnge2_3={currencyCoin1_Exchange2_0} _coin2Net_Excahnge2_3={networkCoin1_Exchange2_0}
        _setStep={setStep} />}


    </div>
  );
}


export default App;
