import React, {useState, useContext, useEffect} from "react"; 
import { WebsocketContext, socket } from "../context/websocket.context";
import { Friends } from "../pages/Chat";

interface Message {
	id: number;
	text: string;
	sender: string;
}

const ChatInterface: React.FC = () => {

	const [value, setValue] = useState('');
	const [data, setData] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [friends, setFriends] = useState<Friends[]>([]);
	const [friendsName, setFriendsName] = useState<string>('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState<Message>({ id: 0, text: '', sender: ''});
	const socket = useContext(WebsocketContext);



	useEffect(() => {
		socket.on('connect', () => {
			console.log('connected')
		})
		socket.on('srv-message', (data) => {
			console.log(`srv-message ${data}`);
			const latest: Message={id:messages.length + 1, text:data, sender:'other'};
			setMessages([...messages, latest]);
		});
		return () => {
			console.log('Unregistering events...')
			socket.off('connect')
			socket.off('srv-message')
		}
	}, [])

	const sendMessage = () => {
		if (socket) {
			socket.emit('create-something', newMessage);
			//console.log('Message sent:', newMessage);
	
		}
		setMessages([...messages, newMessage]);
		setNewMessage({ id: 0, text: '', sender: ''}); // Clear the input field
	  };

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		socket.emit('create-something', value)
	}

	function connect(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		socket.connect()
		setIsLoading(false);
	}

	return (
		<div>
		<p>{ data }</p>
		<button onClick={ connect } >Connect</button>
		<form onSubmit={ onSubmit }>
		<input onChange={ e => setValue(e.target.value) } />
		<button type="submit" disabled={ isLoading }>Submit</button>
		</form>

		<div className="chat-interface">
		<div className="message-display">
			<div className="character-picture">N</div>
			{messages.map((message) => (
			<div
				key={message.id} // Use message.id as the key
				className={`message-bubble ${
					message.sender === 'user' ? 'user' : 'other'
				}`}
				>
				{message.text}
			</div>
			))}
		</div>
		<div className="message-input">
			<input
			className="messages"
			type="text"
			placeholder="Type your message..."
			value={newMessage.text}
			onChange={(e) => setNewMessage({id: 0, text: e.target.value, sender: 'user'})}
			/>
			<button className="sendButton" onClick={sendMessage}>
			Send
			</button>
		</div>
		</div>
		</div>
	);
};

export default ChatInterface;
