import React from 'react'
// import styled from 'styled-components'
import { ChakraProvider, WrapItem, Wrap, CSSReset} from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import Sidebar from '../Components/Sidebar'
import './Home.css'
import {
    extendTheme,
    VStack,
    HStack,
    IconButton,
    Input,
} from '@chakra-ui/react';
import AvatarUpload from '../Components/AvatarUpload'
import { useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { useRef } from 'react'
import RegisterButton from '../LoginForm/RegisterButton'
import { useNavigate } from 'react-router-dom'
import GoogleAuth from '../Components/googleAuth'
import decodeToken from '../helpers/helpers'
import Cookies from 'js-cookie'

type Props = {}

const Home = (props: Props) => {
	const token: string|undefined = Cookies.get("token");
		let content: {username: string, user: number, avatar: string};
	if (token != undefined)
	{
		content = decodeToken(token);
	}
	else
		content = { username: 'default', user: 0, avatar: 'https://multiavatar.com/img/thumb-logo.png'}

    const [avatarUrl, setAvatarUrl] = useState<string>(
        content.avatar
      );
    const fileInputRef = useRef<HTMLInputElement | null>(null);
	const navigate = useNavigate();
    const handleAvatarChange = (newAvatarUrl: string) => {
        setAvatarUrl(newAvatarUrl);

    };
    const handleAvatarClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };

      const handleClick = () => {
        // Navigate to the "/about" page
        navigate('/profiles');
      };

    return (
        <ChakraProvider resetCSS={false}>
        <div>
        <Sidebar/>
        <div>
          <div className='topBox'>

        <Wrap>
            <WrapItem className='profile-border'>
            {/* <div className='profilePic'> */}
            <VStack spacing={4} alignItems="center">
            <Avatar
            size="2xl"
            src={avatarUrl}
            onClick={handleAvatarClick}
            cursor="pointer"/>
            <EditIcon
            boxSize={10}
            cursor="pointer"
            onClick={handleAvatarClick}
            style={{ display: 'none' }}/>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(event) => {
            const file = event.target.files && event.target.files[0];

            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                // setAvatarUrl(dataUrl);
              };
              reader.readAsDataURL(file);
            }
          }}
          />
          {avatarUrl && (
            <AvatarUpload onAvatarChange={handleAvatarChange} />
            )}
            </VStack>
              <h1 className="welcome">Hello {content.username}! </h1>
              <GoogleAuth/>
             </WrapItem>
            </Wrap>
            <button className='quickGame'>
                Take me to the game
            </button>
        </div>
        <div className='displayGrid'>
            <div className='matchHistory'>
                match history<br/>
                <div className='matchBox'>
                  FRIEND 11-5
                </div>
                <div className='matchBox'>
                  FRIEND 8-11
                </div>
                <div className='matchBox'>
                  FRIEND 7-11
                </div>
            </div>
            <div className='achievements'>
                achievements
            </div>
            <div className='friends'>
                <div className='matchBox'>
                  FRIENDS
                </div>
                <div className='matchBox'>
                  FRIENDS
                </div>
                <div className='matchBox'>
                  FRIENDS
                </div>
                <button onClick={handleClick}>
                    click for more
                </button>
            </div>
            </div>
        </div>
        </div>
        </ChakraProvider>
)
}

export default Home;

