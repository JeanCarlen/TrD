import React from 'react'
// import styled from 'styled-components'
import './Home.css'
import LoginForm from '../LoginForm/LoginForm'
import Sidebar from '../Components/Sidebar'

type Props = {}

const Home = (props: Props) => {
    return (
        <div>
        <div className='loginTest'>
            <Sidebar/>
        </div>
        <div className="HomeText">
			My profile
        </div>
        <div className='displayGrid'>
            <div className='profilePic'>
            <img src='https://multiavatar.com/img/thumb-logo.png'/>
            </div>
            <div className='info'>
                username <br></br>
                password
            </div>
            <div className='quickGame'>
                Take me to the game (fuck link)
            </div>
        </div>
        </div>
)
}

export default Home;
