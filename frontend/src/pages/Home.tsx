import React from 'react'
// import styled from 'styled-components'
import './Home.css'
import Sidebar from '../Components/Sidebar'

type Props = {}

const Home = (props: Props) => {
    return (
        <div>
        <Sidebar/>
        <div className='HomeText'>
			My profile
        </div>
        <div className='displayGrid'>
        <span className='columnLeft'>
            {/* <div className='profilePic'> */}
            <img className='prpfilePic' src='https://multiavatar.com/img/thumb-logo.png'/>
                {/* my picture */}
            {/* </div> */}
            <div className='info'>
                username <br></br>
                password
            </div>
            <div className='quickGame'>
                Take me to the game (add link)
            </div>
        </span>
        <div className='columnRight'>
            <div className='matchHistory'>
                match history
            </div>
        </div>
        </div>
        </div>
)
}

export default Home;

