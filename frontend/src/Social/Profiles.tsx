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
import { useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { useRef } from 'react'
import RegisterButton from '../LoginForm/RegisterButton'
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import Searchbar from '../Components/Searchbar'
import Cookies from 'js-cookie'
import decodeToken from '../helpers/helpers'
import { useParams } from 'react-router-dom';
import handleAddFriend from '../Components/AddFriend'

export interface profiles {
	username: string | undefined;
  }
type Props = {}

const Profiles = (props: Props) => {
  const {username} = useParams();
  const token: string|undefined = Cookies.get("token");
  let content: {username: string, user: number};
    if (token != undefined)
    {
      content = decodeToken(token);
    }
    else
    content = { username: 'default', user: 0};
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [achievementName, setAchievementName] = useState<string>('');
  const [friendname, setFriendName] = useState<string>('');
    // const username = content.username;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const GetUserinfo = async () => {

      const response = await fetch(`http://localhost:8080/api/users/username/${username}`, {
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
      }
      const response1 = await fetch(`http://localhost:8080/api/achievement/${content.user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
				  'Authorization': 'Bearer ' + token,
        }
      });
      const achievementData = await response1.json()
      if (response1.ok)
      {
        setAchievementName(achievementData[0].title);
        setAvatarUrl(data[0].avatar);
        setFriendName(data[0].username);
      }
    }

    return (
      <ChakraProvider resetCSS={false}>
          <Searchbar/>
          GetUserinfo()
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
              <h1 className="welcome"> {username} </h1>
             </WrapItem>
            </Wrap>
            <div className='profile-border'>
            <AddIcon boxSize={5} onClick={() => handleAddFriend()}/>
            Add {username} as a friend
            </div>
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

