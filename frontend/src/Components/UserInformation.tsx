import React, { ReactNode, useEffect, useRef } from 'react'
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
  import { toast, ToastContainer } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'
  import ShowMessage from '../Components/ShowMessages'
import NotificationIcon from './Notifications'
import { BellIcon, AddIcon, WarningIcon, SettingsIcon } from '@chakra-ui/icons'
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
  } from '@chakra-ui/react'
  import MFASetup from '../pages/mfasetup'
  import {useNavigate} from 'react-router-dom'
  import { useSelector } from 'react-redux';
  import { setUserStatus } from '../Redux-helpers/action';
  import { useDispatch } from 'react-redux';

type CookieProps = {
	username: string;
};


const UserInformation: React.FC<CookieProps> = ({username}: CookieProps) => {
	const [userID, setUserID] = useState<number>();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure()
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { isOpen: isOpen1 , onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
	const { isOpen: isOpen2 , onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
	// const [count, setCount] = useState<number>();
  	const initialRef = React.useRef(null)
  	const finalRef = React.useRef(null)
	const initialRef1 = React.useRef(null)
  	const finalRef1 = React.useRef(null)
	const initialRef2 = React.useRef(null)
  	const finalRef2 = React.useRef(null)
	const [newName, setNewName] = useState<string>('');
	const [senderID, setSenderID] = useState([]);
	const [senderName, setSenderName] = useState<string>('');
	const [fetched, setFetched] = useState<boolean>(false);
	const [pendingfriends, setPendingFriends] = useState<([])>();
	const [friendRequests, setFriendRequests] = useState<(number[])>();
	const userStatus = useSelector((state: string) => state.userStatus);
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number};
		if (token != undefined)
		{
			content = decodeToken(token);
		}
		else
			content = { username: 'default', user: 0};
	const [tokens, setToken] = useState<any>('');
	let count = 0;
	let sender;
	const updateUser = async () => {
		const response = await fetch(`http://localhost:8080/api/users/username/${username}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		});
		const data = await response.json()
		setUserID(data[0].id);
		const resp = await fetch(`http://localhost:8080/api/friends/pending/list/${data[0].id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
		}
		});
		const data2 = await resp.json()
		if (data2.length > 0)
			{
				count = data2.length;
				console.log("length", count)
				setSenderID(data2[0].requester);
				console.log("data2", data2);
				sender = data2[0].requester_user.username;
				console.log("this is the sender", sender);
				setFetched(true);
				// console.log("this is the sendername", data2[0].requester_user.username);
				for (let i = 0; i < data2.length; i++)
				{
					setSenderName(data2[i].requester_user.username);
					setPendingFriends(data2[i].id);
					setFriendRequests((prevNumbers: number[]) => [...prevNumbers || [], data2[i].id]);
					// ID[i].id = data2[i].id;
					console.log("id", data2[i].id);
				}
			}
		}
		console.log("pending", friendRequests);
		console.log("pending2", pendingfriends);

			useEffect(() =>{
				const token: string|undefined = Cookies.get("token");
				const delay = 2000;

				let content: {username: string, user: number};
				if (token != undefined)
				{
					content = decodeToken(token);
				}
				else
				content = { username: 'default', user: 0};
			// setContent(content);
			dispatch(setUserStatus('Online'));
			updateUser();

		}, []);

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
			  updateUser();
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
		console.log(data);
		// Cookies.set('token', data.token);
		updateUser();
		// setusername
		//setcookies to change the decode token
	}

	const twofa = () => {
		navigate('/mfasetup');
	}



	return (
		<>
		<div>
		<p>User Status in Friends Component: {userStatus}</p>
		</div>
		<Menu>
		<MenuButton as={Button} className='settings' colorScheme='pink'>
			Profile Settings
		</MenuButton>
		<MenuList>
			<MenuGroup title='Profile'>
			<MenuItem onClick={onOpen}>Change Username</MenuItem>
			<MenuItem onClick={onOpen1}>Change my Avatar</MenuItem>
			<MenuItem onClick={onOpen2}>Setup my 2FA </MenuItem>
			</MenuGroup>
			<MenuDivider />
		</MenuList>
		</Menu>
      {/* <SettingsIcon onClick={onOpen} Change Username/> */}
      {/* <Button ml={4} ref={finalRef}>
        I'll receive focus on close
	</Button> */}
		<div>
		{fetched && friendRequests.map((request: number) => (
			<div key={request}>
			<NotificationIcon
				count={count}
				message={"Friend Requests"}
				senderName={senderName[request]}
				senderID={senderID[request]}
				pendingfriends={pendingfriends}
			/>
			</div>
		))}
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
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
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
            <Button onClick={handleAvatarChange} colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose1}>Cancel</Button>
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
	  <ToastContainer/>
    </>
)
}



export default UserInformation
