import { useEffect } from 'react';
import NewsArticleCard from './NewsArticleCard';
import { Card } from 'semantic-ui-react';
import { newsArticlesAtom, userStocksAtom } from '../../lib/atoms';
import { useRecoilState } from 'recoil';

const API = "https://financialmodelingprep.com/api/v3/"

function NewsArticles() {
    const [newsArticles, setNewsArticles] = useRecoilState(newsArticlesAtom);
    const [userStocks, setUserStocks] = useRecoilState(userStocksAtom);
    
    useEffect(() => {
      fetch('/stocks_by_user_id')
        .then((r) => {
          if (!r.ok) {
            throw new Error('Network response was not ok');
          }
          return r.json();
        })
        .then((data) => {
          const tickers = data.map((holding) => holding.stock.ticker.toUpperCase());
          const tickersString = tickers.join(',');
          setUserStocks(tickersString);
        })
        .catch((error) => {
          // Handle fetch or parsing errors here
          console.error('Error fetching data:', error);
        });
    }, [setUserStocks]);

    useEffect(() => {
        fetch(`${API}stock_news?tickers=AAPL,${userStocks}&limit=10&apikey=${process.env.REACT_APP_API_KEY}`)
          .then((r) => r.json())
          .then((data) => {
            const uniqueArticles = filterDuplicateArticles(data);
            setNewsArticles(uniqueArticles);
            // console.log(uniqueArticles);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [userStocks, setNewsArticles]);
      
      function filterDuplicateArticles(articles) {
        const uniqueTitles = new Set();
        return articles.filter((article) => {
          if (uniqueTitles.has(article.title)) {
            return false;
          }
          uniqueTitles.add(article.title);
          return true;
        });
      }
    return (
        <Card.Group itemsPerRow={1} centered>
            {newsArticles.map((article) => <NewsArticleCard key={article.publishedDate} article={article}/>)}
        </Card.Group>
    )
}
export default NewsArticles;