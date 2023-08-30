import React from 'react'
// import styled from 'styled-components'
import './Home.css'
import LoginForm from '../LoginForm/LoginForm'
import Sidebar from '../Components/Sidebar'

type Props = {}

const Home = (props: Props) => {
    return (
		<div className='loginTest'>
            <Sidebar/>
        <div className="HomeText">
			My profile
		</div>
        </div>
    )
}

export default Home;
