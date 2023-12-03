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
  import { toast, ToastContainer } from 'react-toastify'
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
  import { useSelector } from 'react-redux';
  import { setUserName } from '../Redux-helpers/action';
  import { useDispatch } from 'react-redux';
  import { User } from '../chat/idChatUser';
  import '../pages/Chat.css'
  import {Avatar} from '@chakra-ui/react'

type CookieProps = {
	username: string;
};


const UserInformation: React.FC<CookieProps> = ({username}: CookieProps) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure()
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { isOpen: isOpen1 , onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
	const { isOpen: isOpen2 , onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
	const { isOpen: isOpen3 , onOpen: onOpen3, onClose: onClose3 } = useDisclosure()
	// const [count, setCount] = useState<number>();
  	const initialRef = React.useRef(null)
  	const finalRef = React.useRef(null)
	const initialRef1 = React.useRef(null)
  	const finalRef1 = React.useRef(null)
	const initialRef2 = React.useRef(null)
  	const finalRef2 = React.useRef(null)
	const initialRef3 = React.useRef(null)
  	const finalRef3 = React.useRef(null)
	const [newName, setNewName] = useState<string>('');
	const [senderID, setSenderID] = useState([]);
	const [senderName, setSenderName] = useState<string>('');
	const [fetched, setFetched] = useState<boolean>(false);
	const [pendingfriends, setPendingFriends] = useState<(number[])>();
	const [friendRequests, setFriendRequests] = useState<(number[])>();
	const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
	const userStatus = useSelector((state: string) => state.userStatus);
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number};
		if (token !== undefined)
		{
			content = decodeToken(token);
		}
		else
			content = { username: 'default', user: 0};
	let count = 0;
	let sender;
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
		const resp = await fetch(`http://localhost:8080/api/friends/pending/list/${data.id}`, {
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
			// const response2 = await fetch(`http://localhost:8080/api/users/${content.user}`, {
			// 	method: 'PATCH',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		'Authorization': 'Bearer ' + token,
			// 	},
			// 	// body: JSON.stringify({status: 1}),
			// });
			// const dat = await response2.json()
			// console.log("dat", dat);
			console.log("pending", friendRequests);
			console.log("pending2", pendingfriends);
	}

			useEffect(() =>{
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
				// Cookies.set('token', data.token);
				console.log("data", data);
				if (response.ok)
				{
					toast.success('Avatar changed successfully!', {
						position: toast.POSITION.TOP_CENTER
					  })
				}

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
		// setusername
		//setcookies to change the decode token
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
			<MenuItem onClick={getBlockList}>Unblock Users </MenuItem>
			</MenuGroup>
			<MenuDivider />
		</MenuList>
		</Menu>
      {/* <SettingsIcon onClick={onOpen} Change Username/> */}
      {/* <Button ml={4} ref={finalRef}>
        I'll receive focus on close
	</Button> */}
		<div>
		{fetched && friendRequests?.map((request: number) => (
			<div key={request}>
			<NotificationIcon
				count={count}
				message={"Friend Requests"}
				senderName={senderName}
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
              Modify
            </Button>
            <Button onClick={onClose}>Save & Close</Button>
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
            <Button /*onClick={handleAvatarChange} */ onClick={onClose1} colorScheme='blue' mr={3}>
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

	  <ToastContainer/>
    </>
)
}

export default UserInformation;