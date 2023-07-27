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
const today = new Date().toISOString().slice(0, 10); // Get today's date in "YYYY-MM-DD" format
const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5); // Subtract two days from the current date
const fiveDaysAgoFormatted = fiveDaysAgo.toISOString().slice(0, 10); // Get the date of two days ago in "YYYY-MM-DD" format

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

function WatchListCardClosed({ watchedStock, handleRemoveFromWatchList }) {
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
        const response = await fetch(`${API}historical-chart/5min/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}&from=${fiveDaysAgoFormatted}`);
        return response.json();
    }

    useEffect(() => {
        async function getChartData() {
            try {
                const chartData = await getStockPrice();
                // console.log(chartData)
                let dataPrices = []
                for (let i = 0; i < 79; i ++) {
                    dataPrices.push(chartData[i])
                }
                // console.log(dataPrices)
                const prices = dataPrices.map((instance, index) => ({
                x: new Date(instance.date),
                y: [chartData[index].open.toFixed(2), chartData[index].high.toFixed(2), chartData[index].low.toFixed(2), chartData[index].close.toFixed(2)]
            }));
            setSeries([{
                data: prices,
            }]);
            } catch(error) {
                console.log(error)
            }
        }
        getChartData();
    }, []);

    useEffect(() => {
        fetch(`${API}quote/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}`)
        .then((r) => r.json())
        .then((r) => {
            // console.log(r)
            setPrice(r[0].price);
            setOpen(r[0].open);
            setCompanyName(r[0].name);
            setDollarPriceChange(r[0].change);
            setChangePercentage(r[0].changesPercentage);
            setPrevClose(r[0].previousClose);
            setPe(r[0].pe);
            setTwoHundredDayAvg(r[0].priceAvg200);
            setVolume(r[0].volume);
            setAvgVolume(r[0].avgVolume);
        })
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
export default WatchListCardClosed;