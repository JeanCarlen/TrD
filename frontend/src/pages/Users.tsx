import React, { useState } from 'react';
// import styled from 'styled-components'
import './Home.css'
import Sidebar from '../Components/Sidebar'
import'./Users.css'


const Users: React.FunctionComponent = () => {
	return (
		<div className="HomeText">
			<Sidebar/>
			My Friends
		</div>
	)
}

export default Users
