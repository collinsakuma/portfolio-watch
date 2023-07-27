import NewsArticles from "./NewsArticles.js";
import TopGainers from "./TopGainers";
import TopLosers from "./TopLosers";

function Homepage() {
    return (
        <div>
            <div className="top-tables">
                <TopGainers />
                <TopLosers />
            </div>
            <div className="news-header">
                News Feed:
            </div>
            <NewsArticles/>
        </div>
    )
}
export default Homepage;