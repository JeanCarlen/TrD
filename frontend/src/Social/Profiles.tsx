import React from 'react'
// import styled from 'styled-components'
import { ChakraProvider, WrapItem, Wrap, CSSReset} from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import Sidebar from '../Components/Sidebar'
import '../pages/Home.css'
import {
    extendTheme,
    VStack,
    HStack,
    IconButton,
    Input,
    Text,
} from '@chakra-ui/react';
import AvatarUpload from '../Components/AvatarUpload'
import { useState, useEffect} from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { useRef } from 'react'
import RegisterButton from '../LoginForm/RegisterButton'
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import Searchbar from '../Components/Searchbar'
import Cookies from 'js-cookie'
import decodeToken from '../helpers/helpers'
import { useParams } from 'react-router-dom';
import handleAddFriend from '../Components/AddFriend'
import UserInformation from '../Components/UserInformation'
import AddFriend from '../Components/AddFriend'
import {gameData} from '../pages/Stats'
import LayoutGamestats from '../pages/Layout-gamestats'

export interface profiles {
	username: string | undefined;
  }
type Props = {}

const Profiles = (props: Props) => {
  const {users} = useParams();
  const token: string|undefined = Cookies.get("token");
  const [gameFetched, setGameFetched] = useState<boolean>(false);
  const [dataMatches, setDataMatches] = useState<gameData[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [achievementName, setAchievementName] = useState<string>('');
  const [friendid, setFriendID] = useState<number|undefined>();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const GetUserinfo = async () => {
      const response = await fetch(`http://localhost:8080/api/users/username/${users}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
				  'Authorization': 'Bearer ' + token,
        }
      });
      const data = await response.json()
      if (response.ok)
      {
        setAvatarUrl(data[0].avatar);
        await setFriendID(data[0].id);
		console.log ('friendid', data.id);
		await fetchMatches(data[0].id);
      }
      let content: {username: string, user: number};
      if (token != undefined)
      {
        content = decodeToken(token);
      }
      else
        content = { username: 'default', user: 0};
      // const response1 = await fetch(`http://localhost:8080/api/achievement/${content.user}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
			// 	  'Authorization': 'Bearer ' + token,
      //   }
      // });
      // const achievementData = await response1.json()
      // if (response1.ok)
      // {
      //   setAchievementName(achievementData[0].title);
      //   setAvatarUrl(data[0].avatar);
      // }
    }

    useEffect(() =>{
      const token: string|undefined = Cookies.get("token");
      let content: {username: string, user: number};
        if (token != undefined)
        {
          content = decodeToken(token);
        }
        else
          content = { username: 'default', user: 0};
        // setContent(content);
        GetUserinfo();
    }, []);

	const fetchMatches = async (theID:number) => {
		console.log("Fetching matches for user", theID);
		const response = await fetch(`http://localhost:8080/api/matches/users/${theID}`, {
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
				setDataMatches(data.slice(-3).reverse());
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

    return (
      <ChakraProvider resetCSS={false}>
          <Searchbar/>
        <div>
        <Sidebar/>
        <div>
          <div className='topBox'>
        <Wrap>
            <WrapItem className='profile-border'>
            <VStack spacing={4} alignItems="center">
            <Avatar
            size="2xl"
            src={avatarUrl}/>
            </VStack>
              <h1 className="welcome"> {users} </h1>
             </WrapItem>
            </Wrap>
            <div className='profile-border'>
              <AddFriend userID={friendid}/>
            {/* <AddIcon cursor='pointer' boxSize={5} onClick={() => AddFriend(users)}/> */}
            Add {users} as a friend
            </div>
        </div>
        <div className='displayGrid'>
            <div className='matchHistory'>
                match history<br/>
				{gameFetched ? 
					<div className='matchBox'>
					{dataMatches.map((stat: gameData) => {
					return (
						<LayoutGamestats display={stat} userID={friendid}/>
					);
					})}
					</div>
				: <div className='history_1' style={{fontSize:"25px"}}>Loading...</div>
				}
            </div>
            <div className='achievements'>
                {achievementName}
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
            </div>
            </div>
        </div>
        </div>
        </ChakraProvider>
)
}

export default Profiles

