import { useState, useEffect } from 'react';
import { Card } from 'semantic-ui-react';


const API = "https://financialmodelingprep.com/api/v3/"

function HoldingCard({ holding }) {
    // get stock information from holding through its table relationship
    const stock = holding.stock;
    const stockTicker = stock.ticker.toUpperCase();

    const [price, setPrice] = useState(0);
    const [open, setOpen] = useState(0);
    const [change, setChange] = useState(0);
    const [changePercent, setChangePercent] = useState(0);

    // stock real time price for ticker information
    async function getStockQuote() {
        const response = await fetch(`${API}quote/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}`);
        return response.json();
    }


    useEffect(() => {
      let timeoutId;

      async function getCurrentPrice() {
        try {
          const stockData = await getStockQuote();
          // console.log(stockData)
          setPrice(stockData[0].price);
          setOpen(stockData[0].open);
          setChange(stockData[0].change);
          setChangePercent(stockData[0].changesPercentage);
        } catch(error) {
          console.log(error);
        }
        timeoutId = setTimeout(getCurrentPrice, 3000);
      }
      getCurrentPrice();

      return () => {
        clearTimeout(timeoutId);
      }
    },[])

    return (
      <Card style={{margin: 0, width: "60%"}}>
        <Card.Content>
          <div className="ui grid" style={{display: "flex"}}>
            <p className="one wide column"><strong>{holding.stock.ticker.toUpperCase()}</strong></p>
            <p className="three wide column">{holding.stock.company_name}</p>
            <p className="two wide column holding-card-position">{`$ ${price.toFixed(2)}`}</p>
            <p className="two wide column holding-card-position" style={change < 0 ? {color:"red"} : {color:"green"}}>{`$ ${(change).toFixed(2)}`}</p>
            <p className="two wide column holding-card-position" style={changePercent < 0 ? {color:"red"} : {color:"green"}}>{`${(changePercent).toFixed(2)} %`}</p>
            <p className="two wide column holding-card-position">{holding.quantity}</p>
            <p className="two wide column holding-card-position"style={change < 0 ? {color:"red"} : {color:"green"}}>{`$ ${(change * holding.quantity).toFixed(2)}`}</p>
            <p className="two wide column holding-card-position">{`$ ${parseFloat((holding.quantity * price).toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}`}</p>
          </div>
        </Card.Content>
      </Card>
    )
}
export default HoldingCard;
