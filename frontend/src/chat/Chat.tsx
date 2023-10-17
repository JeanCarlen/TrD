import React, { useState, useContext, useEffect } from "react";
import { WebsocketContext } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'
import { list } from "@chakra-ui/react";
import { get } from "http";
import IdChatUser from '../chat/idChatUser';
import ChatInterface from '../chat/ChatInterface';
import Sidebar from '../Components/Sidebar';
import { sentMessages } from './ChatInterface';

type chatData = {
    id: number;
    chat_id : number;
    chat_name: string;
}

const Chat: React.FC = () => {
    const socket = useContext(WebsocketContext);
    const token: string | undefined = Cookies.get("token");
    const [content, setContent] = useState<{username: string, user: number, avatar: string}>();
    const [data, setData] = useState([]);
    const [fetched, setFetched] = useState<boolean>(false);
	const [currentRoom, setCurrentRoom] = useState<string>('default');
	const [roomName, setRoomName] = useState<string>('');
    const [messages, setMessages] = useState<sentMessages[]>([]);

    const getChats = async() => {
        setFetched(false);
        const token: string|undefined = Cookies.get("token");
        let content: {username: string, user: number, avatar: string};
        if (token != undefined)
        {
            content = decodeToken(token);
			setContent(content);
            console.log("content: ", content.user);
        }
        else
            content = { username: 'default', user: 0, avatar: 'default'};

        const response = await fetch(`http://localhost:8080/api/users/${content.user}/chats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        try {
            const data = await response.json();
            const print = JSON.stringify(data);
            console.log("data: ", print);
            if (response.ok)
            {
                console.log("data: ", data);
                setFetched(true);
                setData(data);
            }
            else
                console.log("error in the try");
        }
        catch (error) {
            console.log("error in the catch");
        }
    }
	
	const handleRoomChange = (room: string) => {
		console.log("next room: ", room);
		console.log("currentRoom is : ", currentRoom);
		socket.emit('leave-room', { roomName: currentRoom, socketID: socket.id, client: content?.user });
		socket.emit('join-room', { roomName: room, socketID: socket.id, client: content?.user });
		setCurrentRoom(room);
		console.log("Joined room: ", room);
	};
	
	const handleJoinRoom = (chat: any) => {
		setRoomName(chat.chat_name);
		console.log("Joining room: ", chat.chat_name);
		handleRoomChange(chat.chat_name);
		setRoomName(chat.chat_name);
		getMessages(chat);
	};
	const getMessages = async(chat: any) => {
		const response = await fetch(`http://localhost:8080/api/chats/${chat.chat_id}/messages`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		})
		if (response.ok)
		{
			const messages: sentMessages[] = await response.json();
            setMessages(messages);
			// const printMessages = JSON.stringify(messages);
			console.log("messages: ", messages);
		}
		else
			console.log("error in the getMessages");
	}

	useEffect(() => {
		socket.connect();
		getChats();
	}, []);
	
    return (
        <div>
        <Sidebar/>
    <div className='HomeText'>
        Chat
    </div>
    <div className='grid'>
        <div className="leftColumn">
        <div className="chatList">
        <p>currentRoom: {currentRoom}</p>
        <button onClick={() => getChats()}>Refresh</button>
        {fetched ? <div className="history-1">
        {data.map((chat: chatData) => {
            return (
                <button onClick={() => handleJoinRoom(chat)} key={chat.id} className="game-stats" style={{flexDirection: "column"}}>
                    <div className="box">{chat.chat_name}</div>
                </button>
            );
        })}
        </div> : <div className="history_1"> Loading...</div>}
    </div>
        </div>
        <div className="middleColumn">
            <ChatInterface messagesData={messages}/>
        </div>
        <div className="rightColumn">
            <IdChatUser Idduchat={2} ChatType={0}/>
        </div>
    </div>
    </div>
    );
};

export default Chat;
