import React, { useState, useContext, useEffect } from "react";
import { WebsocketContext, socket } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'

const ChatList: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [tokenContent, setTokenContent] = useState<JWTPayload>();

	useState(() => {
		const token: string | undefined = Cookies.get("token");
		if (token) {
			let content: JWTPayload = decodeToken(token)
			setTokenContent(content)
		}

	}
	);

	function connect(e: React.FormEvent) {
		e.preventDefault();
		if (!socket.connected) {
		  setIsLoading(true);
		  socket.connect();
		}
	  }

return (
	<div>
      {isLoading && <p>Loading...</p>}

	<button onClick={connect} disabled={isLoading || socket.connected}>
	{socket.connected ? "Connected" : "Connect"}
	</button>
	</div>
	)};

export default ChatList;