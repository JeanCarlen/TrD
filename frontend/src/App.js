import logo from './cow.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Chat from './Chat'
import './index.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
      </p>
      <a>
        Hello loosers
      </a>
      <div className="chat-start">
        <Chat/>
      </div>
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


