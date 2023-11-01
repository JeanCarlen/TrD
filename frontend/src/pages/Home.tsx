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
import {ToastContainer, toast} from 'react-toastify'
import {gameData, User} from './Stats'

type Props = {}



const Home = (props: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [gameFetched, setGameFetched] = useState<boolean>(false);
  const [dataLast, setDataLast] = useState<gameData[]>([]);
  const [friendsFetched, setFriendsFetched] = useState<boolean>(false);
  const token: string|undefined = Cookies.get("token");
  let content: {username: string, user: number, avatar: string};

	const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

	const fetchMatches = async () => {
		const response = await fetch(`http://localhost:8080/api/matches/users/${content.user}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			});
		if (response.ok)
		{
			try {
				const data = await response.json();
				setGameFetched(true);
				console.log("Data fetched", data);
				setDataLast(data.slice(-3));
			}
			catch (e) {
				console.log("Error in response", e);
			}
		}
		else
		{
			console.log("Error fetching matches");
		}
	}

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
		toast.success('Avatar changed successfully', { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-success' });
        //add a toast
      }
    };

	useEffect (() => {
		fetchMatches();
	}, []);

    return (
		<div>
        <ChakraProvider resetCSS={false}>
        <Searchbar/>
        <UserInformation username={content.username}/>
        <div>
        <Sidebar/>
        <div>
          <div className='topBox'>
            <form action=''>
              <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              />
            </form>
            <Wrap>
            <WrapItem className='profile-border'>
            <VStack spacing={4} alignItems="center">
            <Avatar
            size="2xl"
            src={content.avatar}
            />
            <EditIcon
            boxSize={10}
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
					{dataLast.map((achievement: gameData) => {
					return (
						<LayoutGamestats display={achievement} userID={content.user}/>
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
		<ToastContainer/>
		</div>
)
}

export default Home;

