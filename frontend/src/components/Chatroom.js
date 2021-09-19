import React, { useContext, useEffect, useRef, useState } from "react";
import "./Chatroom.css"

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { io } from "socket.io-client";
import { AuthContext } from "../Context/AuthContext";
import axios from 'axios'

import Message from './Message'

import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { Redirect, useHistory, useParams } from "react-router";
import Countdown from 'react-countdown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function Chatroom() {

    const { random_user_id, chatroom_id } = useParams()
    const [chatroomExist, setChatroomExist] = useState(["data"])

    const { user } = useContext(AuthContext);
    const socket = useRef();


    useEffect(() => {
        const getChatroom = async () => {
            try {
                const response = await axios.get(API_URL + "api/chatrooms/" + user._id)
                console.log(response.data)
                setChatroomExist(response.data)
            } catch (error) {
                console.log(error)
            }
        };
        getChatroom();
    }, [])

    const currentchat = {
        _id: chatroom_id,
        members: [user._id, random_user_id]
    }

    const API_URL = process.env.REACT_APP_API_URL

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const addEmoji = (e) => {
        let emoji = e.native;
        setNewMessage(newMessage + emoji);
    };

    const [pick, setPick] = useState(false);
    const openPicker = () => {
        setPick(!pick);
    };


    useEffect(() => {
        socket.current = io(API_URL);
        socket.current.on("getMessage", (data) => {
            console.log(data)
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, [API_URL]);

    useEffect(() => {
        arrivalMessage &&
            currentchat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        socket.current.emit("addUser", user?._id);
    }, [user, currentchat, socket]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await axios.get(API_URL + "api/messages/" + currentchat?._id);
                setMessages(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const sendingMessage = {
            chatroomId: currentchat._id,
            senderId: user._id,
            text: newMessage,
        };

        const receiverId = currentchat.members.find(
            (member) => member !== user._id
        );

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });

        try {
            const response = await axios.post(API_URL + "api/messages/", sendingMessage);
            setMessages([...messages, response.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
        setPick(false)
    };

    const deleteRoom = async () => {
        try {
            await axios.delete(API_URL + "api/chatrooms/remove/chatroom/" + chatroom_id)
            setChatroomExist([])
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        chatroomExist?.length !== 0 ?
            <>
                <div className="home" >
                    <div className="home-components">
                        <div className="chatroom">
                            <div className="chatroom-header">
                                <div>Ananomous User</div>
                                <div className="right-icons">
                                    <Countdown className="countdown" date={Date.now() + 1800000} onComplete={() => { deleteRoom() }} />
                                    {
                                        <ExitToAppIcon className="exit-icon" onClick={()=>{deleteRoom()}}/>
                                    }
                                </div>
                            </div>
                            <div className="chatroom-messages-container" onClick={() => { setPick(false) }}>
                                {messages.map((message) => (
                                    <div key={message?._id}>
                                        <Message message={message} own={message?.senderId === user._id} />
                                    </div>
                                ))}
                            </div>
                            <div className={pick ? "emoji-picker-open" : "emoji-picker-close"} >
                                <Picker onSelect={addEmoji} emojiSize={25} />
                            </div>
                            <div className="chatroom-footer">
                                <div className="chatroom-footer-lefticons">
                                    <IconButton onClick={openPicker}>
                                        <InsertEmoticonIcon />
                                    </IconButton>
                                    <IconButton>
                                        <AttachFileIcon />
                                    </IconButton>
                                </div>
                                <form>
                                    <input className="message-input" type="text" name="message-input" placeholder="Type a message" onChange={(e) => { setNewMessage(e.target.value); }} value={newMessage} required />
                                    <button className="input-button" onClick={newMessage ? handleSubmit : null} > Send a Message </button>
                                </form>
                                <div className="chatroom-footer-righticon" onClick={newMessage ? handleSubmit : null} >
                                    <IconButton>
                                        <SendIcon className="send-icon" />
                                    </IconButton>
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            </>
            : <Redirect to="/" />
    )
}
export default Chatroom
