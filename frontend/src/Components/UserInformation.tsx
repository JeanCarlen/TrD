import React, { useEffect } from 'react'
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
import { BellIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'


type CookieProps = {
	username: string;
  };

const UserInformation: React.FC<CookieProps> = ({username}) => {
	const [userID, setUserID] = useState<number>();
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [count, setCount] = useState<number>(0);
  	const initialRef = React.useRef(null)
  	const finalRef = React.useRef(null)
	const [newName, setNewName] = useState<string>('');
	const [senderID, setSenderID] = useState([]);
	const [fetched, setFetched] = useState<boolean>(false);
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number};
		if (token != undefined)
		{
			content = decodeToken(token);
		}
		else
			content = { username: 'default', user: 0};
	const [tokens, setToken] = useState<any>('');

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
		if (data2.length != 0)
			{
				setCount(data2.length);
				console.log("data2", data2)
				setSenderID(data2);
				setFetched(true);
				console.log("this is the senderID", data2[0].requester)

			}
		console.log(data2);
	}

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
			updateUser();

		}, []);



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

	return (
		<>
      <Button onClick={onOpen}>Change Username</Button>
      {/* <Button ml={4} ref={finalRef}>
        I'll receive focus on close
	</Button> */}
		<div>
			{fetched}
			{senderID?.map((requests:any) => {
				return (
					<div key={requests}>
					<NotificationIcon
					count={count}
					message={"Friend Requests"}
					senderID={requests.requester}/>
					</div>
				);
			})}
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
              <Input value={newName} onChange={(e) => setNewName(e.target.value)}ref={initialRef} placeholder='New Username' />
            </FormControl>

            {/* <FormControl mt={4}>
              <FormLabel>Last name</FormLabel>
              <Input placeholder='Last name' />
            </FormControl> */}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => updateUsername(newName)} colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
	  <ToastContainer/>
    </>
)

}

export default UserInformation
