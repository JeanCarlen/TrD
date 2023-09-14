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


type Props = {}

const Profiles = (props: Props) => {
    const [avatarUrl, setAvatarUrl] = useState<string>(
        'https://multiavatar.com/img/thumb-logo.png'
      );
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleAvatarChange = (newAvatarUrl: string) => {
        setAvatarUrl(newAvatarUrl);

    };
    const handleAvatarClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
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
                setAvatarUrl(dataUrl);
              };
              reader.readAsDataURL(file);
            }
          }}
          />
          {avatarUrl && (
            <AvatarUpload onAvatarChange={handleAvatarChange} />
            )}
            </VStack>
              <h1 className="welcome">"Nick name of user" </h1>
             </WrapItem>
            </Wrap>
            <div className='profile-border'>
            <AddIcon boxSize={5} />
              <Text>
            "Add as a friend"
            </Text>
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
            </div>
            </div>
        </div>
        </div>
        </ChakraProvider>
)
}

export default Profiles;

