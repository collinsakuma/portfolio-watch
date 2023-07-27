import { useState, useEffect } from 'react';
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
        .then((r) => r.json())
        .then((r) => {
            let array = [];
            r.map((holding) => {
                array.push(holding.stock.ticker.toUpperCase());
            })
            setUserStocks(array.toString());
        })
    },[])

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
      }, [userStocks]);
      
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