import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isMarketOpenAtom } from '../../lib/atoms';

const API = "https://financialmodelingprep.com/api/v3/"

function TopGainers() {
    const [topFiveGainer, setTopFiveGainer] = useState([]);
    const isMarketOpen = useRecoilValue(isMarketOpenAtom);

    useEffect(() => {
        let timeoutId;
      
        async function getTopGainers() {
          try {
            const response = await fetch(`${API}stock_market/gainers?limit=10&apikey=${process.env.REACT_APP_API_KEY}`);
            const data = await response.json();
            const topFive = [];
            for (let i = 5; i < 10; i++) {
              topFive.push(data[i]);
            }
            setTopFiveGainer(topFive);
          } catch (error) {
            console.log(error);
          }
        }
      
        function isOpen() {
          getTopGainers();
          timeoutId = setTimeout(isOpen, 30000);
        }
      
        function isClosed() {
          getTopGainers();
          clearTimeout(timeoutId);
        }
      
        if (isMarketOpen) {
          isOpen();
        } else {
          isClosed();
        }
      
        return () => {
          clearTimeout(timeoutId);
        };
      }, [isMarketOpen]);

    const topFiveTable = topFiveGainer.map((stock) => {
        return (
            <tr key={stock.symbol}>
                <td className="table-elements">{stock.symbol}</td>
                <td className="table-elements">{stock.name}</td>
                <td className="table-elements">{(stock.price).toFixed(2)}</td>
                <td className="table-elements" style={{color: "green"}}>⬆{(stock.change).toFixed(2)}</td>
                <td className="table-elements" style={{color: "green"}}>⬆{(stock.changesPercentage).toFixed(2)} %</td>
            </tr>
        )
    })

    return (
        <div style={{margin:"75px"}}>
            <h3>Stock Gainers:</h3>
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
export default TopGainers;