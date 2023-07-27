import { useState, useEffect } from 'react';
import { Button, Card } from 'semantic-ui-react';
import Chart from 'react-apexcharts';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const API = "https://financialmodelingprep.com/api/v3/"
const today = new Date().toISOString().slice(0, 10);

// chart formating
const chart = {
    options: {
        chart: {
        type: 'candlestick',
        height: 350
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled:true
        }
      }
    },
  };

  // material UI Table
  function createData(one, two) {
    return {one, two};
  }

function WatchListCardOpen({ watchedStock, handleRemoveFromWatchList }) {
    // get stock information from holding through its table relationship
    const stock = watchedStock.stock;
    const stockTicker = stock.ticker.toUpperCase()

    const [series, setSeries] = useState([{
        data: []
    }]);

    const [price, setPrice] = useState(0);
    const [open, setOpen] = useState(0);
    const [companyName, setCompanyName] = useState("");
    const [dollarPriceChange, setDollarPriceChange] = useState(0);
    const [changesPercentage, setChangePercentage] = useState(0);
    const [prevClose, setPrevClose] = useState(0);
    const [pe, setPe] = useState(0);
    const [twoHundredDayAvg, setTwoHundredDayAvg] = useState(0);
    const [volume, setVolume] = useState(0);
    const [avgVolume, setAvgVolume] = useState(0);

    const rows = [
        createData("Previous Close", prevClose.toFixed(2), "PE", pe),
        createData("Open", open.toFixed(2)),
        createData("200 Day Average", twoHundredDayAvg.toFixed(2)),
        createData("PE", pe),
        createData("Volume", volume.toLocaleString('en-US')),
        createData("Average Volumne", avgVolume.toLocaleString('en-US'))
    ]

    // stock one minute price for candle stick chart
    async function getStockPrice() {
        const response = await fetch(`${API}historical-chart/1min/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}&from=${today}`);
        return response.json();
    }

    // stock real time price for ticker information
    async function getStockQuote() {
        const response = await fetch(`${API}quote/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}`);
        return response.json();
    }

    useEffect(() => {
        let timeoutId;
        
        async function getChartData() {
            try {
                const chartData = await getStockPrice();
                // console.log(chartData)
                const prices = chartData.map((instance, index) => ({
                x: new Date(instance.date),
                y: [chartData[index].open.toFixed(2), chartData[index].high.toFixed(2), chartData[index].low.toFixed(2), chartData[index].close.toFixed(2)]
            }));
            setSeries([{
                data: prices,
            }]);
            } catch(error) {
                console.log(error)
            }
            timeoutId = setTimeout(getChartData, 60000);
        }
        
        getChartData();
        
        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        let timeoutId;

        async function getCurrentPrice() {
        try {
            const stockData = await getStockQuote();
            // console.log(stockData);
            setPrice(stockData[0].price);
            setOpen(stockData[0].open);
            setCompanyName(stockData[0].name);
            setDollarPriceChange(stockData[0].change);
            setChangePercentage(stockData[0].changesPercentage);
            setPrevClose(stockData[0].previousClose);
            setPe(stockData[0].pe);
            setTwoHundredDayAvg(stockData[0].priceAvg200);
            setVolume(stockData[0].volume);
            setAvgVolume(stockData[0].avgVolume);
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
        <Card style={{ width: "80%" }}>
            <Card.Content>
                <div style={{display: "flex"}}>
                    <h2>{companyName}</h2>
                    <Button className='watchlist-card-button' onClick={() => handleRemoveFromWatchList(watchedStock.id)}>Remove From Watchlist</Button>
                </div>
                <div style={{ display: "flex"}}>
                    <p className="price">{price.toFixed(2)}</p>
                    <div className="price-movement" style={{display:"flex"}}>
                    <p className="price-margins" style={dollarPriceChange < 0 ? {color:"red"} : {color:"green"}}>{(dollarPriceChange).toFixed(2)}</p>
                    <p className="price-margins" style={changesPercentage < 0 ? {color:"red"} : {color:"green"}}>{`(${(changesPercentage).toFixed(2)}%)`}</p>
                    </div>
                </div>
                <div style={{display: "flex", marginTop:"20px"}}>
                    <div style={{marginRight: "20px"}}>
                        <h3>Summary</h3>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="simple table">
                                <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left">{row.one}</TableCell>
                                    <TableCell align="right">{row.two}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div style={{flex: "1"}}>
                        <Chart options={chart.options} series={series} type="candlestick" width="100%" height={320}/>
                    </div>
                </div>                   
            </Card.Content>
        </Card>

    )
}
export default WatchListCardOpen;