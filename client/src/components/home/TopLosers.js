import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isMarketOpenAtom } from '../../lib/atoms';

const API = "https://financialmodelingprep.com/api/v3/"

function TopLosers() {
    const [topFiveLosers, setTopFiveLosers] = useState([]);
    const isMarketOpen = useRecoilValue(isMarketOpenAtom);

    useEffect(() => {
        let timeoutId;

        async function getTopLosers() {
            try {
                fetch(`${API}stock_market/losers?limit=10&apikey=${process.env.REACT_APP_API_KEY}`)
                .then((r) => r.json())
                .then((r) => {
                    let topFive = [];
                    for (let i = 5; i < 10; i ++) {
                        topFive.push(r[i]);
                    }
                    setTopFiveLosers(topFive);
                })
            } catch(error) {
                console.log(error)
            }
        }
      
        function startTimer() {
            getTopLosers();
            timeoutId = setTimeout(startTimer, 30000);
          }
        
          function stopTimer() {
            clearTimeout(timeoutId);
          }
        
          if (isMarketOpen) {
            startTimer();
          } else {
            stopTimer();
          }
        
          return () => {
            clearTimeout(timeoutId);
          };
    },[isMarketOpen]);

    const topFiveTable = topFiveLosers.map((stock) => {
        return (
            <tr key={stock.symbol}>
                <td className="table-elements">{stock.symbol}</td>
                <td className="table-elements">{stock.name}</td>
                <td className="table-elements">{(stock.price).toFixed(2)}</td>
                <td className="table-elements" style={{color: "red"}}>⬇{(stock.change).toFixed(2)}</td>
                <td className="table-elements" style={{color: "red"}}>⬇{(stock.changesPercentage).toFixed(2)} %</td>
            </tr>
        )
    })

    return (
        <div style={{margin:"75px"}}>
            <h3>Stock Losers:</h3>
            <table className='table-styles'>
                <thead>
                    <tr>
                        <th className="table-elements-header">Symbol</th>
                        <th className="table-elements-header">Name</th>
                        <th className="table-elements-header">Price</th>
                        <th className="table-elements-header">$ change</th>
                        <th className="table-elements-header">% Change</th>
                    </tr>
                </thead>
                <tbody>
                    {topFiveTable}
                </tbody>
            </table>
        </div>
        
    )
}
export default TopLosers;