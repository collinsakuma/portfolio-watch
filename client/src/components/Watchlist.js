import WatchListCardOpen from "./WatchListCardOpen";
import { Button, Form, Card } from 'semantic-ui-react';
import { useEffect } from "react";
import WatchListCardClosed from './WatchListCardClosed';
import { userAtom, isMarketOpenAtom, tickerAtom, watchStocksArrayAtom } from '../lib/atoms';
import { useRecoilValue, useRecoilState } from "recoil";

const API = "https://financialmodelingprep.com/api/v3/"

function Watchlist() {
    const [ticker, setTicker] = useRecoilState(tickerAtom);
    const [watchedStocksArray, setWatchedStocksArray] = useRecoilState(watchStocksArrayAtom);
    const user = useRecoilValue(userAtom);
    const isMarketOpen = useRecoilValue(isMarketOpenAtom);

    const handleAddStockToWatchList = (e) => {
        e.preventDefault();
        fetch(`${API}quote/${ticker}?apikey=${process.env.REACT_APP_API_KEY}`)
            .then((r) => r.json())
            .then((r) => {
                let newStock = {
                    ticker: `${(r[0].symbol.toLowerCase())}`,
                    company_name: `${r[0].name}`,
                    price: 0
                }
                fetch('/stocks', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newStock),
                })
                .then((r) => {
                    // if the stock already exist in the db it will fetch the id of that stock using the ticker set in state
                        fetch('/stocks')
                            .then((r) => r.json())
                            .then((r) => {
                                const matchingStock = r.find((stock) => stock.ticker === ticker.toLowerCase())
                                
                                let newWatchedStock = {
                                    user_id: user.id,
                                    stock_id: matchingStock.id
                                }

                                
                                fetch('/watched_stocks', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(newWatchedStock)
                                })
                                .then(() => {
                                    fetch('/watched_stocks_by_user')
                                        .then((r) => r.json())
                                        .then(setWatchedStocksArray)
                                })
                            })

                    return r.json();
                })
            })
            setTicker('');
    }

    useEffect(() => {
        fetch('/watched_stocks_by_user')
        .then((r) => r.json())
        .then(setWatchedStocksArray)
    },[])

    const handleRemoveFromWatchList = (watchedStockId) => {
        fetch(`/watched_stocks/${watchedStockId}`, {
            method: "DELETE",
        })
        .then(() => {
            setWatchedStocksArray((prevState) => {
                // filter out the deleted watched stock from the state
                return prevState.filter((watchedStock) => watchedStock.id !== watchedStockId)
            })
        })
    }
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:"20px" }}>
                <Form style={{ width: "30%", backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "10px" }} onSubmit={handleAddStockToWatchList}>
                    <p className="add-stocks">Add Stocks to Watchlist</p>
                    <Form.Field style={{ alignItems: "center", marginBottom: "20px" }}>
                    <label style={{ marginRight: "10px" }}>Search By Ticker</label>
                    <Form.Input
                        name="searchTicker"
                        type="string"
                        placeholder="company ticker"
                        value={ticker.toUpperCase()}
                        onChange={(e) => setTicker(e.target.value)}
                    />
                    </Form.Field>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button type="submit">
                        <Button.Content>
                        Add to WatchList
                        </Button.Content>
                    </Button>
                    </div>
                </Form>
            </div>
            <br></br>
            <div className="watchlist-title">
                Watchlist
            </div>
            <Card.Group itemsPerRow={1} centered>
                {isMarketOpen ? (
                    watchedStocksArray.map((watchedStock) => (
                        <WatchListCardOpen
                            key={watchedStock.id}
                            watchedStock={watchedStock}
                            handleRemoveFromWatchList={handleRemoveFromWatchList}
                        />
                    ))
                ) : (
                    watchedStocksArray.map((watchedStock) => (
                        <WatchListCardClosed 
                            key={watchedStock.id} 
                            watchedStock={watchedStock}
                            handleRemoveFromWatchList={handleRemoveFromWatchList}
                        />
                    ))
                )}
            </Card.Group>
        </div>
    )
}
export default Watchlist;