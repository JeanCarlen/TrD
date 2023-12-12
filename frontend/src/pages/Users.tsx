import React, { useState } from 'react';
// import styled from 'styled-components'
import './Home.css'
import Sidebar from '../Components/Sidebar'
import Searchbar from '../Components/Searchbar'
import'./Users.css'
import {
	MultiChatWindow,
	MultiChatSocket,
	useMultiChatLogic,
  } from 'react-chat-engine-advanced';

const Users: React.FunctionComponent = () => {
	return (
		<div className="HomeText">
			<Sidebar/>
			My Friends
		</div>
	)
}

export default Users
