import React,{useEffect,useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News =(props)=> {

    const [articles,setArticles] = useState([])
    const [loading,setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [totalResults,setTotalResults] = useState(0)
    //document.title=`${capitalizeFirstLetter(props.category)} - NewsMonkey`;

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 
    
     const updateNews = async ()=> {
         props.setProgress(10);
        const url=`https://newsapi.org/v2/top-headlines?country=in&category=${props.category}&apiKey=${props.apiKey}&page=1&pageSize=${props.pageSize}`;
        setLoading(true);
        props.setProgress(30);
        let data = await fetch(url);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }
    
    useEffect(()=>{
        updateNews();
        //eslint-disable-next-line
    },[])
    

      const fetchMoreData = async () => {   
        const url=`https://newsapi.org/v2/top-headlines?country=in&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage( page+1)
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
        setLoading(false);
        
      };

        return (
            <> 
                <h1 className="text-center" style={{margin:"60px 0"}}>
                    NewsMonkey - Top Headlines from {capitalizeFirstLetter(props.category)}</h1>
                   
                {loading && <Spinner/>}
               <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                > 
                <div className="container">
                <div className="row">
                {articles.map((element)=>{
                  return  <div className="col-md-4" key={element.url}>
                    <NewsItem  title={element.title?element.title.slice(0,45):""}
                     description={element.description?element.description.slice(0,88):""}
                      imageUrl={element.urlToImage?element.urlToImage:"https://i.cdn.newsbytesapp.com/images/l2620210927135145.jpeg"} 
                      newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                    </div>
                })}
                
                </div>
                </div>
                </InfiniteScroll>
            </>
        )
    }
News.defaultProps={
    country:'in',
    pageSize:8,
    category:"general"
}

News.propTypes={
    country:PropTypes.string,
    pageSize:PropTypes.number,
    category:PropTypes.string,
}

export default News
