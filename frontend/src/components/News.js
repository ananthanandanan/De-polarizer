import axios from "axios";
import React, { useEffect, useState } from "react";
import NewsArticle from "./NewsArticle";


function News() {
  const [data, setData] = useState();
  
  useEffect(() => {
    const refresh = async () => {
      try {
        await axios
          .get(
            `https://newsapi.org/v2/everything?q=tesla&from=2021-08-18&sortBy=publishedAt&apiKey=8ff9d03d1adf4cb0bb610ba2e419a274`
          )
          .then((response) => setData(response.data))
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error)
      }
    }
    refresh();
  }, []);

  return (
    <div className="news__container">
      <div className="all__news">
        {data
          ? data.articles.map((news) => (
            <NewsArticle data={news} key={news.url} />
          ))
          : "Loading"}
      </div>
    </div >
  );
}

export default News;
