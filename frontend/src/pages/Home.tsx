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
import ShowStatus from '../Components/FriendStatus'
import { useSelector } from 'react-redux';
import { setUserName, setUserStatus } from '../Redux-helpers/action';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import GetUserName from '../Components/testusername'
import MyStatus from '../Components/Status'
import GameInvite from '../Game/Game-Invite'

type Props = {
    username: string;
    user: number;
    avatar: string;
    status: string;
}



const Home = (props: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [gameFetched, setGameFetched] = useState<boolean>(false);
  const [dataLast, setDataLast] = useState<gameData[]>([]);
  const [friendsFetched, setFriendsFetched] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const dispatch = useDispatch();
  const mainUsername = useSelector((state: string) => state.username);
  const userStatus = useSelector((state: string) => state.userStatus);
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
				let data = await response.json();
        data.sort((a: gameData, b: gameData) => (a.id > b.id) ? 1 : -1);
				setGameFetched(true);
				console.log("Data fetched", data);
				setDataLast(data.slice(-3).reverse());
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

  const updateUser = async () => {
		const response = await fetch(`http://localhost:8080/api/users/${content.user}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		});
		const data = await response.json()
    if (response.ok)
    {
      console.log("does it fetch", data);
      console.log("current status", data.status);
      // dispatch(setUserStatus(data.status));
      content.username = data.username;
      setUsername(data.username);
      console.log(content.username);
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


	useEffect (() => {
		fetchMatches();
    updateUser();
	}, []);

    return (
		<div>
        <ChakraProvider resetCSS={false}>
        <Searchbar/>
        <UserInformation username={mainUsername}/>
        <div>
        <Sidebar/>
        <div>
          <div className='topBox'>
            <Wrap>
            <WrapItem className='profile-border'>
            <VStack spacing={4} alignItems="center">
            <Avatar
            size="2xl"
            src={content.avatar}
            />
              <div className='icon-container'>
              <div className='status-circle'>
                <MyStatus />
            </div>
          </div>
            </VStack>
              <GetUserName username={content.username}/>
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
                {/* <div className='matchBox'> */}
                <FriendList/>
                </div>
              </div>
            </div>
        </div>
        {/* </div> */}
        </ChakraProvider>
		<GameInvite/>
		<ToastContainer/>
		</div>
)
}

export default Home;

