import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';

function Chat() {
	const [socket, setSocket] = useState(null);
      const [messages, setMessages] = useState([]);
      const [messageText, setMessageText] = useState('');
      const [joined, setJoined] = useState(false);
      const [name, setName] = useState('');
      const [typingDisplay, setTypingDisplay] = useState('');

      useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.emit('findAllMessages', {}, (response) => {
          setMessages(response);
        });

        newSocket.on('message', (message) => {
          setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
          newSocket.disconnect();
        };
      }, []);

      const join = () => {
        socket.emit('join', { name: name }, () => {
          setJoined(true);
        });
      };

      const sendMessage = () => {
        socket.emit('createMessage', { text: messageText }, () => {
          setMessageText('');
        });
      };

      let timeout;
      const emitTyping = () => {
        socket.emit('typing', { isTyping: true });
        timeout = setTimeout(() => {
          socket.emit('typing', { isTyping: false });
        }, 2000);
      };

    return (
      <div className="chat">
        <div className="chat-container">
          <div className="messages-container">
            {this.props.messages.map(message => (
              <div key={message.id}>
                [{message.name}]: {message.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

 export default Chat;
