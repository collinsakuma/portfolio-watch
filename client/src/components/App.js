import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Header from "./Header";
import Navbar from "./Navbar";
import Homepage from "./home/Homepage";
import Watchlist from "./Watchlist";
import Holdings from "./holdings/Holdings";
import UpdatePortfolio from "./UpdatePortfolio";
import Transactions from "./Transactions";
import TickerHeader from "./TickerHeader";
import SenateTrading from "./gov_trading/governemtTrading";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom, isMarketOpenAtom } from "../lib/atoms";

const API = "https://financialmodelingprep.com/api/v3/"

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  const setIsMarketOpen = useSetRecoilState(isMarketOpenAtom);

  async function checkMarketOpen() {
    const response = await fetch(`${API}/is-the-market-open?apikey=${process.env.REACT_APP_API_KEY}`);
    return response.json();
  }

  // function to check is the stock market is currently open every 30 seconds
  useEffect(() => {
    let timeoutId;

    async function isOpen() {
      try {
        const market = await checkMarketOpen();
        setIsMarketOpen(market.isTheStockMarketOpen);
      } catch(error) {
        console.log(error);
      }
      timeoutId = setTimeout(isOpen, 2000);
    }
    isOpen();

    return () => {
      clearTimeout(timeoutId);
    }
  },[])


  useEffect(() => {
    fetch("/check_session")
      .then((r) => {
        if (r.ok) {
          r.json().then((user) => setUser(user));
        }
      });
  }, []);
  
  if (!user) return <Login/>;

  return (
    <div>
      <div>
        <Header />
        <Navbar/> 
        <TickerHeader />
      </div>
      <div>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/watchlist">
            <Watchlist/>
          </Route>
          <Route exact path="/holdings">
            <Holdings/>
          </Route>
          <Route exact path="/update_portfolio">
            <UpdatePortfolio/>
          </Route>
          <Route exact path="/transactions">
            <Transactions />
          </Route>
          <Route>
            <SenateTrading />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default App;
