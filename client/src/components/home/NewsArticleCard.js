import { Card } from 'semantic-ui-react';

function NewsArticleCard({ article }) {
    return (
        <Card style={{width: "60%", boxShadow:"none"}}>
            <Card.Content style={{display:"flex"}}>
                <div style={{marginRight: "25px"}}>
                    <img className="article-image" src={article.image}></img>
                </div>
                <div>
                    <div style={{opacity: "50%", marginBottom: "10px"}}>
                        <p>Article From: {article.site}</p>
                    </div>
                    <a className="articles-link" href={article.url} target="_blank">{article.title}</a>
                    <p className="article-text" style={{marginTop:"5px"}}>{article.text}</p>
                </div>
            </Card.Content>
        </Card>
    )
}
export default NewsArticleCard;