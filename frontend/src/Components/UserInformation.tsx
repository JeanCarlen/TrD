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

type CookieProps = {
	username: string;
  };

const UserInformation: React.FC<CookieProps> = ({username}) => {
	// const [userData, setUserData] = useState<any>([]);
	const { isOpen, onOpen, onClose } = useDisclosure()
  	const initialRef = React.useRef(null)
  	const finalRef = React.useRef(null)
	const [newName, setNewName] = useState<string>('');
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
		console.log("in UPDATE: ", username);
		const response = await fetch(`http://localhost:8080/api/users/username/${username}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		});
		const data = await response.json()
		console.log(data);
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
			// updateUser();
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
		console.log("this is sent", newName);
		console.log(data);
		Cookies.set('token', data.token);
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
    </>
)

}

export default UserInformation
