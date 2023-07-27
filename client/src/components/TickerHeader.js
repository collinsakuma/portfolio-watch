import { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import { isMarketOpenAtom } from '../lib/atoms';
import { useRecoilValue } from 'recoil';

const API = "https://financialmodelingprep.com/api/v3/"

async function getMajorAverages() {
    const response = await fetch(`${API}quote/%5EGSPC,%5EDJI,%5EIXIC?apikey=${process.env.REACT_APP_API_KEY}`);
    return response.json();
}

function TickerHeader() {
    const isMarketOpen = useRecoilValue(isMarketOpenAtom);
    const [sAndP, setSAndP] = useState(0);
    const [sAndPChange, setSAndPChange] = useState(0);
    const [dowJ, setDowJ] = useState(0);
    const [dowJChange, setDowJChange] = useState(0);
    const [nasdaq, setNasdaq] = useState(0);
    const [nasdaqChange, setNasdaqChange] = useState(0);



    useEffect(() => {
        let timeoutId;
        async function fetchMajorAverages() {
            try {
                const averagesData = await getMajorAverages();
                // console.log(averagesData);
                setSAndP(averagesData[0].price);
                setSAndPChange(averagesData[0].change);
                setDowJ(averagesData[1].price);
                setDowJChange(averagesData[1].change);
                setNasdaq(averagesData[2].price);
                setNasdaqChange(averagesData[2].change);
            } catch(error) {
                console.log(error);
            }
            timeoutId = setTimeout(fetchMajorAverages, 3000);
        }
        fetchMajorAverages();

        return () => {
            clearTimeout(timeoutId);
          }
    },[])

    // return averages with color
    const displayAverage = (averageChange) => {
        if (averageChange > 0) {
            return (
                <p style={{color: "green"}}>&nbsp;&nbsp;⬆&nbsp;{averageChange.toFixed(2)}</p>
            )
        }
        if (averageChange < 0) {
            return (
                <p style={{color: "red"}}>&nbsp;&nbsp;⬇&nbsp;{averageChange.toFixed(2)}</p>
            )
        }
    }
    // console.log(isMarketOpen)
    return (
        <div className="marquee-ticker">
            {isMarketOpen ? (
                    <div>
                        <div style={{margin:"0px", height:"20px"}}>
                        </div>
                        <Marquee>
                        <div className="ticker-header" style={{display: "flex"}}>
                            <div style={{display: "flex", marginRight:"400px"}}>
                                <p><strong>S&P 500&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(sAndP.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                                {displayAverage(sAndPChange)}
                            </div>
                            <div style={{display: "flex", marginRight:"400px"}}>
                                <p><strong>Dow Jones Industrial&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(dowJ.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                                {displayAverage(dowJChange)}
                            </div>
                            <div style={{display: "flex", marginRight:"400px"}}>
                                <p><strong>NASDAQ&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(nasdaq.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                                {displayAverage(nasdaqChange)}
                            </div>
                        </div>
                    </Marquee>
                </div>
            ) : (
                <Marquee>
                    <div>
                        <div style={{margin:"0px", height:"20px"}}>
                        </div>
                        <div className="ticker-header" style={{display: "flex"}}>
                            <div style={{display: "flex"}}>
                                <p><strong>S&P 500&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(sAndP.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                                {displayAverage(sAndPChange)}
                            </div>
                            <div style={{marginRight: "200px", marginLeft: "200px"}}>
                                Market Closed
                            </div>
                            <div style={{display: "flex"}}>
                                <p><strong>Dow Jones Industrial&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(dowJ.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                                {displayAverage(dowJChange)}
                            </div>
                            <div style={{marginRight: "200px", marginLeft: "200px"}}>
                                Market Closed
                            </div>
                            <div style={{display: "flex"}}>
                                <p><strong>NASDAQ&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(nasdaq.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                                {displayAverage(nasdaqChange)}
                            </div >
                            <div style={{marginRight: "200px", marginLeft: "200px"}}>
                                Market Closed
                            </div>
                        </div>
                    </div>
                </Marquee>
            )}
        </div>
        // <Marquee>
        //     <div className="ticker-header" style={{display: "flex"}}>
        //         <div style={{display: "flex", marginRight:"400px"}}>
        //             <p><strong>S&P 500&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(sAndP.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
        //             {displayAverage(sAndPChange)}
        //         </div>
        //         <div style={{display: "flex", marginRight:"400px"}}>
        //             <p><strong>Dow Jones Industrial&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(dowJ.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
        //             {displayAverage(dowJChange)}
        //         </div>
        //         <div style={{display: "flex", marginRight:"400px"}}>
        //             <p><strong>NASDAQ&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(nasdaq.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
        //             {displayAverage(nasdaqChange)}
        //         </div>
        //     </div>
        // </Marquee>
    )
}
export default TickerHeader;