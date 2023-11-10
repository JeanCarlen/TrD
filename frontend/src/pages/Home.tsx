import React, { useEffect } from 'react'
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
import GoogleAuth from '../Components/2FA'
import decodeToken from '../helpers/helpers'
import Cookies from 'js-cookie'
import Searchbar from '../Components/Searchbar'
import FriendList from '../Components/Friends'
import UserInformation from '../Components/UserInformation'
import LayoutGamestats from './Layout-gamestats'
import {gameInfo} from './Stats'

type Props = {}

const Home = (props: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gameFetched, setGameFetched] = useState<boolean>(false)
  const token: string|undefined = Cookies.get("token");
  let content: {username: string, user: number, avatar: string};

	const data1: gameInfo= {
		score1: 11,
		score2: 2,
		player1: 'Steve',
		player2: 'Patrick',
	}

	const data2: gameInfo= {
		score1: 6,
		score2: 11,
		player1: 'Steve',
		player2: 'Jcarlen',
	}

	const data3: gameInfo= {
		score1: 11,
		score2: 5,
		player1: 'Steve',
		player2: 'ALEX',
	}

	const data4: gameInfo= {
		score1: 9,
		score2: 11,
		player1: 'Steve',
		player2: 'Eliott',
	}

	const alldata: gameInfo[]= [data1, data2, data3, data4];
	const dataLast: gameInfo[] = alldata.slice(-3)
	const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

	const yourFunction = async () => {
		await delay(5000);
		setGameFetched(true);
	};

    if (token != undefined)
      content = decodeToken(token);
    else
      content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'}

    const avatarUrl = content.avatar

  const handleAvatarChange =  async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
      event.preventDefault();

      if (file) {
        const reader = new FormData();
        reader.append('file', file);
      console.log("FILE BEFORE FETCH ", reader.get('file'));
      const response = await fetch('http://localhost:8080/api/file', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
          },
          body: reader,
        })
        const data = await response.json()
        Cookies.set('token', data.token);
        //add a toast
      }
    };

	useEffect (() => {
		yourFunction();
	}, []);

    return (
        <ChakraProvider resetCSS={false}>
        <Searchbar/>
        <UserInformation username={content.username}/>
        <div>
        <Sidebar/>
        <div>
          <div className='topBox'>
            {/* <form action=''>
              <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              />
            </form> */}
            <Wrap>
            <WrapItem className='profile-border'>
            <VStack spacing={4} alignItems="center">
            <Avatar
            size="2xl"
            src={content.avatar}
            />
            </VStack>
              <h1 className="welcome">Hello {content.username}! </h1>
             </WrapItem>
            </Wrap>
            <button className='quickGame'>
                Take me to the game
            </button>
        </div>
        <div className='displayGrid'>
            <div className='matchHistory'>
                match history<br/>
                {gameFetched ?
					<div className='matchBox'>
					{dataLast.map((achievement) => {
					return (
						<LayoutGamestats {...achievement}/>
					);
					})}
					</div>
				: <div className='history_1' style={{fontSize:"25px"}}>Loading...</div>
				}
            </div>
            <div className='achievements'>
                achievements
            </div>
            <div className='friends'>
                <div className='matchBox'>
                <FriendList/>
                </div>
              </div>
            </div>
        </div>
        </div>
        </ChakraProvider>
)
}

export default Home;

