import { useState, useEffect } from "react";
import HoldingCard from "./HoldingCard";
import { Card } from 'semantic-ui-react'

function Holdings() {
    const [userStocks, setUserStocks] = useState([]);

    useEffect(() => {
        fetch(`/stocks_by_user_id`)
            .then((r) => r.json())
            .then(setUserStocks)
    },[])
    return (
        <div>
            <div className="holdings-title">
                Personal Holdings
            </div>
            <Card.Group itemsPerRow={1} centered style={{marginTop:"20px"}}>
                <Card style={{margin: 0, width: "60%"}}>
                    <Card.Content style={{marginBottom: "1px"}}>
                    <div className="ui grid" style={{display: "flex", marginBottom:"-25px", marginTop:"5px"}}>
                        <p className="one wide column card-header">Symbol</p>
                        <p className="three wide column card-header">Name</p>
                        <p className="two wide column holding-card-position card-header">Share price</p>
                        <p className="two wide column holding-card-position card-header">$ change</p>
                        <p className="two wide column holding-card-position card-header">% change</p>
                        <p className="two wide column holding-card-position card-header">Quantity</p>
                        <p className="two wide column holding-card-position card-header">Total value change</p>
                        <p className="two wide column holding-card-position card-header">Total value</p>
                    </div>
                    </Card.Content>
                </Card>
                {userStocks.map((holding) => <HoldingCard key={holding.id} holding={holding}/>)}
            </Card.Group >
        </div>
    )
}
export default Holdings;