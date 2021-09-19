import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useHistory } from 'react-router-dom'


function NewsArticle({ data }) {

  const [allUsers, setAllUsers] = useState([]);

  const { user } = useContext(AuthContext)
  const [randomUser, setRandomUser] = useState(user)

  const API_URL = process.env.REACT_APP_API_URL


  useEffect(() => {
    const refresh = async () => {
      try {
        await axios.get(API_URL + "api/users/all/users").then((response) => setAllUsers(response.data)).catch((error) => console.log(error));
      } catch (error) {
        console.log(error)
      }
    }
    refresh();
  }, []);

  const history = useHistory();
  const navigate = (url) => {
    history.push(`/${url}`);
  }

  const clickHandler = async (e) => {
    e.preventDefault()
    try {
      const chatroom_exist = await axios.get(API_URL + "api/chatrooms/" + user._id)
      console.log(chatroom_exist.data)
      if (chatroom_exist.data.length !== 0) {
        const members = await chatroom_exist.data[0].members
        console.log(members)
        navigate(`chatroom/${members[1] !== user?._id ? members[1] : members[0]}/${chatroom_exist.data[0]._id}`)
      }
      else {
        do {
          const random_user = allUsers[Math.floor(Math.random() * allUsers.length)];
          setRandomUser(random_user)
          if (random_user._id !== user._id) {
            const api_data = {
              senderId: user._id,
              receiverId: random_user?._id
            }
            const response = await axios.post(API_URL + 'api/chatrooms', api_data)
            navigate(`chatroom/${random_user._id}/${response.data._id}`)
            break
          }
        }
        while (randomUser._id === user._id)
      }

    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="news" onClick={(e) => clickHandler(e)}>
      <h1 className="news__title">{data.title}</h1>
      <p className="news__desc">{data.description}</p>
      <span className="news__author">{data.author}</span> <br />
      <span className="news__published">{data.publishedAt}</span>
      <span className="news__source">{data.source.name}</span>
    </div>
  );
}

export default NewsArticle;