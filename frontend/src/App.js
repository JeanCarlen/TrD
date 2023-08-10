import logo from './cow.svg';
import './App.css';
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  return (
      const [socket, setSocket] = useState(null);
      const [messages, setMessages] = useState([]);
      const [messageText, setMessageText] = useState('');
      const [joined, setJoined] = useState(false);
      const [name, setName] = useState('');
      const [typingDisplay, setTypingDisplay] = useState('');

      useEffect(() => {
        const newSocket = io('http://localhost:3001');
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

    <div className="App">
      <header className="App-header">
        <div className="messages-container">
      {     messages.map((message, index) => (
           <div key={index}>
              [{message.name}]: {message.text}
        </div>
          ))}
       </div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        </p>
        <a
        >
          Hello loosers
        </a>
      </header>

    </div>
  );

}

export default App;

// // vue to be changed to react:
// import { onBeforeMount, ref } from 'vue';
// const socket = io('http://localhost:3001');
// const messages = ref([]);
// const messageText = ref('');
// const joined = ref(false);
// const name = ref('');
// const typingDisplay = ref('');


// onBeforeMount(() => {
//   socket.emit('findAllMessages', {}, (response) => {
//     messages.value = response;
//   })
//   socket.on('message', (message ) =>
//   {
//     messages.value.push(message);
//   });
// })

// const join = () => {
//   socket.emit('join', {name: name.value}, () => {
//     joined.value = true;
//   })
// }

// const sendMessage = () => {
//   socket.emit('createMessage', {text: messageText}, response =>
//   {
//     messageText.value = '';
//   })
// }

// let timeout;
// const emitTyping = () => {
//   socket.emit('typing', { isTyping: true});
//   timeout = setTimeout(() => {
//     socket.emit('typing', {isTyping: false});
//   }, 2000);

// }

// {/* <div class= "messages-container">
//    <div v-for = "message in messages">
//   [{{ message.name }}]: {{ message.text }}
//   </div>
// </div> */}
// //


