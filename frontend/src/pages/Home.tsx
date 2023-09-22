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
import Searchbar from '../Components/Searchbar'
import FriendList from '../Components/Friends'

type Props = {}

const Home = (props: Props) => {
    const [avatarUrl, setAvatarUrl] = useState<any>(
      'https://multiavatar.com/img/thumb-logo.png'
    );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const token: string|undefined = Cookies.get("token");
    let content: {username: string, user: number};
    if (token != undefined)
    {
      content = decodeToken(token);
    }
    else
      content = { username: 'default', user: 0}
    const handleAvatarChange =  async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      //setSelectedFile(file);
      //console.log(selectedFile);
      event.preventDefault();

      if (file) {
        const reader = new FormData();
        reader.append('file', file);
      // reader.onload = (e) => {
      //   e.preventDefault();
      //   const dataUrl = e.target?.result as string;
      // };
      //reader.readAsDataURL(file);
      //setAvatarUrl(reader);
      // event.preventDefault();
      console.log("FILE BEFORE FETCH ", reader.get('file'));
      const response = await fetch('http://localhost:8080/api/file', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token,
          },
          body: reader,
        })
        .then(() => {
          console.log("GOOD");
        })
        .catch(err => {
        console.log(err);
      })
    }
  };

  const SendFile = async(file: File | null, event: React.ChangeEvent<any>) => {
    // const formData = new FormData();
    // formData.append('file', file);
      // const data = await response.json()
      // console.log(file);
      // if (response.ok)
      // {
      //   // Cookies.set('token', data.token)
      // }
  }
    // const navigate = useNavigate();
    // const handleAvatarClick = () => {

      // console.log()
      // if (fileInputRef.current) {
      //   fileInputRef.current.click();
      // }
      // };

      // const handleClick = () => {
      //   // Navigate to the "/about" page
      //   navigate(`/profiles/${content.username}`);
      // };

    return (
        <ChakraProvider resetCSS={false}>
        <Searchbar/>
        <div>
        <Sidebar/>
        <div>
          <div className='topBox'>
            <form /*encType='multipart/form-data'*/ action=''>
              <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
                // const file = event.target.files && event.target.files[0];
                //   console.log(event.target.files)
                // if (file) {
                //   const reader = new FileReader();
                //   reader.onload = (e) => {
                //     // handleAvatarChange(e)
                //   }
                    /*= (e) => {
                    const dataUrl = e.target?.result as string;
                    // setAvatarUrl(dataUrl);
                  };
                  // reader.readAsDataURL(file);
                // }*/
              />
             {/* <button onClick={(event) => handleAvatarChange(event)}>Update</button> */}
            </form>
            <Wrap>
            <WrapItem className='profile-border'>
            {/* <div className='profilePic'> */}
            <VStack spacing={4} alignItems="center">
            <Avatar
            size="2xl"
            src={avatarUrl}
            // onClick={handleAvatarClick}
            cursor="pointer"/>
            <EditIcon
            boxSize={10}
            cursor="pointer"
            // onClick={handleAvatarClick}
          // onClick={handleAvatarChange}
            // style={{ display: 'none' }}/>
        />
          {/* {avatarUrl && (
            <onClick={handleAvatarChange} />
            )} */}
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

