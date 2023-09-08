import React from 'react';
import Sidebar from '../Components/Sidebar';
import { Avatar, AvatarBadge, AvatarGroup, CSSReset } from '@chakra-ui/react'
import {Wrap, WrapItem, Text} from '@chakra-ui/react'
import { avatarAnatomy } from '@chakra-ui/anatomy'
import { ChakraProvider } from '@chakra-ui/react'
import './Home.css'

const Chat: React.FunctionComponent = () => {
	return (
		<div>
		<div className='HomeText'>
            <Sidebar/>
			Chat
		</div>
		<ChakraProvider resetCSS={false}>
			<Wrap>
			<WrapItem>
			<Avatar size='lg'name='Dan Abrahmov' src='https://bit.ly/dan-abramov'>
			<AvatarBadge borderColor='green.600' boxSize='0.8em' bg='green.600'>
			</AvatarBadge>
			</Avatar>
			</WrapItem>
			<WrapItem>
    		<Avatar size='lg' src='htps://bit.ly/kent-c-dodds'>
			<AvatarBadge borderColor='red' bg='red' boxSize='0.8em'/>
			</Avatar>
 	 		</WrapItem>
			</Wrap>
		</ChakraProvider>
		</div>
	)
}

export default Chat
