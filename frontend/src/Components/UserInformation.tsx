import React, { useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import { useState } from 'react'
import decodeToken from '../helpers/helpers'
import { useDisclosure } from '@chakra-ui/react'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
  } from '@chakra-ui/react'
import { Button, FormControl, FormLabel, Input} from '@chakra-ui/react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NotificationIcon from './Notifications'
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuGroup,
	MenuDivider,
  } from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import { setUserName } from '../Redux-helpers/action';
import { useDispatch } from 'react-redux';
import { User } from '../chat/idChatUser';
import '../pages/Chat.css'
import {Avatar} from '@chakra-ui/react'


type CookieProps = {
	username: string;
	userStatus: number;
};


const UserInformation: React.FC<CookieProps> = ({username}: CookieProps) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure()
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { isOpen: isOpen1 , onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
	const { isOpen: isOpen2 , onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
	const { isOpen: isOpen3 , onOpen: onOpen3, onClose: onClose3 } = useDisclosure()
  	const initialRef = React.useRef(null)
  	const finalRef = React.useRef(null)
	const initialRef1 = React.useRef(null)
  	const finalRef1 = React.useRef(null)
	const initialRef2 = React.useRef(null)
  	const finalRef2 = React.useRef(null)
	const initialRef3 = React.useRef(null)
  	const finalRef3 = React.useRef(null)
	const [newName, setNewName] = useState<string>('');
	const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number, avatar:string};
		if (token !== undefined)
		{
			content = decodeToken(token);
		}
		else
		{
			content = {
			  username: "default",
			  user: 0,
			  avatar: "http://localhost:8080/images/default.png",
			}
		  };

	const updateUser = async () => {
		const response = await fetch(`http://localhost:8080/api/users/${content.user}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		});
		const data = await response.json()
		console.log("data should have status", data);
		console.log("status", data.status);
	}

			useEffect(() =>{
			updateUser();
			navigate('/home');
		}, [token]);

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
				console.log("data", data);
				if (response.ok)
				{
					toast.success('Avatar changed successfully!', {
						position: toast.POSITION.TOP_CENTER
					  })
					Cookies.set('token', data.token);
					updateUser();
				}
				else {
					toast.error('Wrong file format!', {
						position: toast.POSITION.TOP_CENTER
					  })
					return ;
				}
			  }
			};

		const updateUsername = async (newName:string) => {
			const response = await fetch(`http://localhost:8080/api/users/${content.user}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify({username: newName}),
		});
		const data = await response.json()
		if (response.ok)
		{
			toast.success('Username changed successfully!', {
				position: toast.POSITION.TOP_CENTER
			  })
			  updateUser();
			  dispatch(setUserName(newName));
		}
		console.log(username);
		Cookies.set('token', data.token);
	}

	async function getBlockList()
	{
		const response = await fetch(`http://localhost:8080/api/users/${content?.user}/blocked`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});
		if (response.ok)
		{
			let bList = await response.json();
			console.log('banned list: ', bList);
			await setBlockedUsers(bList);
			onOpen3();
		}
	}

	async function deleteAccount(){
		const response = await fetch(`http://localhost:8080/api/users/${content.user}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});
		if (response.ok)
		{
			Cookies.remove('token')
			toast.success('Your account got deleted', {
				position: toast.POSITION.TOP_CENTER
			})
			navigate('/logout');
		}
	}

	async function unBlockUser(user: User){
		const response = await fetch(`http://localhost:8080/api/users/unblock/${user.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});
		if (response.ok)
		{
			toast.success(`${user.username} was successfully unblocked`, {
				position: toast.POSITION.TOP_CENTER
			})
		}
	}

	const twofa = () => {
		navigate('/mfasetup');
	}

	return (
		<>
		<Menu>
		<MenuButton as={Button} className='settings' colorScheme='pink'>
			Profile Settings
		</MenuButton>
		<MenuList>
			<MenuGroup title='Profile'>
			<MenuItem onClick={onOpen}>Change Username</MenuItem>
			<MenuItem onClick={onOpen1}>Change my Avatar</MenuItem>
			<MenuItem onClick={onOpen2}>Setup my 2FA </MenuItem>
			<MenuItem onClick={getBlockList}>Unblock Users </MenuItem>
			<MenuItem onClick={deleteAccount}>Delete my account</MenuItem>
			</MenuGroup>
			<MenuDivider />
		</MenuList>
		</Menu>
		<div>
		<NotificationIcon/>
		</div>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change username</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={7}>
            <FormControl>
              <FormLabel>New Username</FormLabel>
              <Input value={newName} onChange={(e:any) => setNewName(e.target.value)}ref={initialRef} placeholder='New Username' />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => updateUsername(newName)} colorScheme='blue' mr={3}>
              Modify
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
		</ModalContent>
		</Modal>


		<Modal
		initialFocusRef={initialRef1}
        finalFocusRef={finalRef1}
        isOpen={isOpen1}
        onClose={onClose1}
		>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change avatar</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={7}>
			<FormControl>
			  <FormLabel>New Avatar</FormLabel>
			  <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange}/>
			</FormControl>
          </ModalBody>


		  <ModalFooter>
            <Button onClick={onClose1} colorScheme='blue' mr={3}>
			  Save & Close
            </Button>
          </ModalFooter>
		</ModalContent>
      </Modal>

	  <Modal
		initialFocusRef={initialRef2}
        finalFocusRef={finalRef2}
        isOpen={isOpen2}
        onClose={onClose2}
		>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Setup 2FA</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={7}>
		  <FormLabel>Setup 2FA</FormLabel>
          </ModalBody>
		  <ModalFooter>
            <Button onClick={twofa} colorScheme='blue' mr={3}>
              Go
            </Button>
            <Button onClick={onClose2}>Cancel</Button>
          </ModalFooter>
		</ModalContent>
      </Modal>

	  <Modal
		initialFocusRef={initialRef3}
        finalFocusRef={finalRef3}
        isOpen={isOpen3}
        onClose={onClose3}
		>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Blocked Users</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={7}>
		  <FormLabel>Unblock Users</FormLabel>
		  {blockedUsers?.map((user: User) => {
				return (
				<div className="banBox">
					<Avatar size='md' src={user.avatar} name={user.username}/>
					<div>{user.username}</div>
					<Button style={{marginLeft: 'auto'}} onClick={() => {
						unBlockUser(user);
						onClose3();
					}}>Unblock</Button>
				</div>
				)
			})}
          </ModalBody>
		</ModalContent>
      </Modal>
    </>
)
}

export default UserInformation;