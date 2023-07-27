import { Button, Form, Label } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { userAtom } from '../lib/atoms';
import { useRecoilValue } from "recoil";

const API = "https://financialmodelingprep.com/api/v3/"

function UpdatePortfolio() {
    const [newOrUpdate, setNewOrUpdate] = useState(true);
    const [ticker, setTicker] = useState("");
    const [foundStock, setFoundStock] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [quote, setQuote] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [stockId, setStockId] = useState(0);
    const [canSubmit, setCanSubmit] = useState(true);
    const [canSell, setCanSell] = useState(true);
    const user = useRecoilValue(userAtom);
    
    // state for update stock
    const [numSharesOwned, setNumSharesOwned] = useState(0);
    const [numSharesToSell, setNumSharesToSell] = useState(0);

    // check if form has valid quote and quanity entered before allowing form submission
    useEffect(() => {
        if (quote > 0 && quantity > 0) {
            setCanSubmit(false)
        }
    },[quote, quantity])

    useEffect(() => {
        if (quote > 0 && numSharesToSell > 0) {
            setCanSell(false)
        }
    },[quote, numSharesToSell])

    //reset state on form selection (clear forms)
    const resetState = () => {
        setFoundStock([]);
        setTicker("");
        setCompanyName("");
        setQuote(0);
        setStockId(0);
        setQuantity(0);
        setCanSubmit(true);
        setCanSell(true);
        setNumSharesOwned(0);
        setNumSharesToSell(0);
    }

    // Add form information and post stock to Stocks table
    const handleTickerSearch = (e) => {
        e.preventDefault();
        fetch(`${API}quote/${ticker}?apikey=${process.env.REACT_APP_API_KEY}`)
            .then((r) => r.json())
            .then(setFoundStock)
    }
    useEffect(() => {
        if (foundStock.length !== 0) {
            setCompanyName(foundStock[0].name);
            setQuote(foundStock[0].price);
            let newStock = {
                ticker: `${(foundStock[0].symbol.toLowerCase())}`,
                company_name: `${foundStock[0].name}`,
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
                if (!r.ok) {
                    fetch('/stocks')
                        .then((r) => r.json())
                        .then((r) => {
                            const matchingStock = r.find((stock) => stock.ticker === ticker.toLowerCase())
                            setStockId(matchingStock.id);
                        })
                }
                return r.json();
            })
            // if the stock does not exist in the db it will return the response and setStockId to the response.id
            .then((r) => {
                setStockId(r.id)
            })
        }
    },[foundStock])

    const handleAddStock = (e) => {
        e.preventDefault();
        let newTransaction = {
            // user state passed down from App
            user_id: user.id,
            stock_id: stockId,
            quantity: quantity,
            bought_total: (quantity * quote),
            sold_total: 0,
            share_price: quote
        }
        fetch('/transactions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTransaction)
        })
        // update an existing OwnedStock if user already owns stock or create new OwnedStock instance
        fetch(`/stocks_by_user_id`)
            .then((r) => r.json())
            .then((r) => {
                console.log(r, "response")
                console.log(stockId)
                let ownedStock = r.find((stock) => stock.stock_id === stockId);
                console.log(ownedStock,"ownedStocks")
                if (ownedStock === undefined) {
                    let newOwnedStock = {
                        user_id: user.id,
                        stock_id: stockId,
                        quantity: quantity,
                        total_cost: (quantity * quote)
                    }
                    fetch('/owned_stocks', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newOwnedStock)
                    })
                }
                if (ownedStock !== undefined) {
                    console.log("run update")
                    let update = {
                        quantity: parseFloat(ownedStock.quantity) + parseFloat(quantity),
                        total_cost: ownedStock.total_cost + (quantity * quote)
                    }
                    fetch(`/owned_stocks/${ownedStock.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(update)
                    })
                }
            })
        // reset state
        setFoundStock([]);
        setCompanyName("");
        setQuantity(0);
        setQuote(0);
        setStockId(0);
        setTicker("");
    }

    // Sell Form Code

    const handleTickerSearchSell = (e) => {
        e.preventDefault();
        fetch(`${API}quote/${ticker}?apikey=${process.env.REACT_APP_API_KEY}`)
            .then((r) => r.json())
            .then(setFoundStock)
    }

    useEffect(() => {
        fetch('/stocks_by_user_id')
            .then((r) => r.json())
            .then((r) => {
                let ownedStock = r.find((stock) => stock.stock_id === stockId)
                if (ownedStock !== undefined) {
                    setNumSharesOwned(ownedStock.quantity)
                }
            })
    },[handleTickerSearchSell])

    const handleSetNumSharesToSell = (e) => {
        if (e.target.value <= numSharesOwned && e.target.value >= 0) {
            setNumSharesToSell(parseInt(e.target.value));
        }
    }

    const handleSellStocks = () => {
        // add new sell transaction
        let newTransaction = {
            // user state passed down from App
            user_id: user.id,
            stock_id: stockId,
            quantity: numSharesToSell,
            bought_total: 0,
            sold_total: (numSharesToSell * quote),
            share_price: quote 
        }
        fetch('/transactions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTransaction)
        })
        // find the ownedStock instance and either update or delete it. 
        fetch(`/stocks_by_user_id`)
        .then((r) => r.json())
        .then((r) => {
            let ownedStock = r.find((stock) => stock.stock_id === stockId);
            console.log("here")
            console.log(numSharesOwned, numSharesToSell);
            if (numSharesToSell < numSharesOwned) {
                console.log("update ownedStock")
                let update = {
                    quantity: parseFloat(ownedStock.quantity) - parseFloat(numSharesToSell),
                    // total_cost: ownedStock.total_cost + (quantity * quote)
                }
                fetch(`/owned_stocks/${ownedStock.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(update)
                })
            }
            if (numSharesToSell === numSharesOwned) {
                console.log("delete ownedStock")
                fetch(`/owned_stocks/${ownedStock.id}`, {
                    method: "DELETE",
                })
            }
        })
        .then(resetState());
    }

    return (
        <div>
            <div style={{display:"flex", margin:"20px", justifyContent:"center", marginTop:"40px"}}>
                <Button onClick={() => {
                    setNewOrUpdate(true);
                    resetState();
                    }}
                    >Buy</Button>
                <Button onClick={() => {
                    setNewOrUpdate(false);
                    resetState();
                    }}>Sell</Button>
            </div>
            <div>
                {newOrUpdate ? (
                    <div>
                        <div className="watchlist-title" style={{textAlign:"center"}}>
                            Add To Portfolio
                        </div>
                        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <div  style={{ width: "30%", backgroundColor: "#f0f0f0", padding: "60px", borderRadius: "10px"}}> 
                                <Form onSubmit={handleTickerSearch}>
                                    <Form.Field>
                                        <Label>Search by Ticker</Label>
                                        <Form.Input 
                                            name="ticker"
                                            type="text"
                                            value={ticker.toUpperCase()}
                                            onChange={(e) => setTicker(e.target.value)}
                                            placeholder="ticker"
                                        />
                                    </Form.Field>
                                    <Button type="submit" style={{marginBottom:"20px", width:"30%"}}>Search</Button>
                                </Form>
                                <Form onSubmit={handleAddStock}>
                                    <Form.Field>
                                        <Form.Input 
                                            name="company"
                                            type="text"
                                            value={companyName}
                                            placeholder="Company Name"
                                            readOnly
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Share Price</Label>
                                        <Form.Input 
                                            name="quote"
                                            type="number"
                                            value={quote.toFixed(2)}
                                            onChange={(e) => setQuote(e.target.value)}
                                            placeholder="Share Price"
                                            readOnly
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Buy Quantity</Label>
                                        <Form.Input
                                            name="quantity"
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder="Share Quantity"
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Total Price</Label>
                                        <Form.Input 
                                            name="totalCost"
                                            type="string"
                                            value={`$ ${(quantity * quote).toFixed(2)}`}
                                            placeholder="Total Cost"
                                            readOnly
                                        />
                                    </Form.Field>
                                    <Button type="submit" disabled={canSubmit} style={{width:"-webkit-fill-available"}}>
                                        Add Stock
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="watchlist-title" style={{textAlign:"center"}}>
                            Sell From Portfolio
                        </div>
                        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <div style={{ width: "30%", backgroundColor: "#f0f0f0", padding: "60px", borderRadius: "10px"}}>
                                <Form onSubmit={handleTickerSearchSell}>
                                    <Form.Field>
                                    <Label>Search by Ticker</Label>
                                        <Form.Input 
                                            name="ticker"
                                            type="text"
                                            value={ticker.toUpperCase()}
                                            onChange={(e) => setTicker(e.target.value)}
                                            placeholder="ticker"
                                        />
                                    </Form.Field>
                                    <Button type="submit" style={{marginBottom:"20px", width:"30%", textAlign:"center"}}>Search</Button>
                                </Form>
                                <Form onSubmit={handleSellStocks}>
                                    <Form.Field>
                                        <Form.Input 
                                            name="company"
                                            type="text"
                                            value={companyName}
                                            placeholder="Company Name"
                                            readOnly
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Share Price</Label>
                                        <Form.Input 
                                            name="quote"
                                            type="number"
                                            value={quote.toFixed(2)}
                                            onChange={(e) => setQuote(e.target.value)}
                                            placeholder="Share Price"
                                            readOnly
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Number of Shares Owned</Label>
                                        <Form.Input 
                                            name="sharesOwned"
                                            type="number"
                                            value={numSharesOwned}
                                            readOnly
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Sell Quantity</Label>
                                        <Form.Input 
                                            name="sellAmount"
                                            type="number"
                                            value={numSharesToSell}
                                            onChange={(e) => handleSetNumSharesToSell(e)}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Total Price</Label>
                                        <Form.Input 
                                            name="sellTotal"
                                            type="string"
                                            value={`$ ${(numSharesToSell * quote).toFixed(2)}`}
                                        />
                                    </Form.Field>
                                    <Button type="submit"  disabled={canSell} style={{width:"-webkit-fill-available"}}>
                                        Confirm
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    </div>
    )
}
export default UpdatePortfolio;