import React from 'react'
// import styled from 'styled-components'
import './Home.css'
import RegisterButton from '../LoginForm/RegisterButton'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'


const SignIn: React.FunctionComponent = () => {

    return (
        <div className="HomeText">
			<RegisterButton />
		</div>
    )
}

export default SignIn;
