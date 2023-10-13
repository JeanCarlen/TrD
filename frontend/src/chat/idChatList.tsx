import React, { useState, useContext, useEffect } from "react";
import { WebsocketContext } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'
import { list } from "@chakra-ui/react";

type chatData = {
    id: number;
    type: number;
    name: string;
    owner: number;
}

const ListOfChats: React.FC = () => {
    const socket = useContext(WebsocketContext);
    const token: string | undefined = Cookies.get("token");
    const [content, setContent] = useState<{username: string, user: number, avatar: string}>();
    const [data, setData] = useState([]);
    const [fetched, setFetched] = useState<boolean>(false);

    const getChats = async() => {
        setFetched(false);
        const token: string|undefined = Cookies.get("token");
        let content: {username: string, user: number};
        if (token != undefined)
        {
            content = decodeToken(token);
        }
        else
            content = { username: 'default', user: 0};

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

	useEffect(() => {
		getChats();
	}, []);

    return (
        <div className="chatList">
			<button onClick={() => getChats()}>Refresh</button>
            {fetched ? <div className="history-1">
            {data.map((data: chatData) => {
                return (
                    <button key={data.id} className="game-stats" style={{flexDirection: "column"}}>
						<div className="box">{data.name}</div>
                    </button>
                );
            })}
            </div> : <div className="history_1"> Loading...</div>}
        </div>
    );
};

export default ListOfChats;