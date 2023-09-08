import React from 'react'
// import styled from 'styled-components'
import './Home.css'
import Sidebar from '../Components/Sidebar'
import Searchbar from '../Components/Searchbar'
import'./Users.css'


const Users: React.FunctionComponent = () => {
	return (
		<div className="HomeText">
			<Sidebar/>
			My Friends
            <Searchbar/>
		</div>
	)
	}

export default Users
