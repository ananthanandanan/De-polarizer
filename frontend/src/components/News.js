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
            "http://api.mediastack.com/v1/news?access_key=573ea93d458bc7656c9279808cda889e"
          )
          .then((response) => setData(response.data.data))
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
          ? data.map((news) => (
            <NewsArticle data={news} key={news.url} />
          ))
          : "Loading"}
      </div>
    </div >
  );
}

export default News;
