import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import '../pages/Users.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Searchbar() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');

	const token = Cookies.get('token');

	const handleSearch = async () => {
		const response = await fetch(`${process.env.REACT_APP_HOST}api/users/username/${searchTerm}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
		});
		const data = await response.json()
		if (response.ok && searchTerm)
		{
			if (!data[0])
			{
				toast.error("User not found", {
					position: toast.POSITION.BOTTOM_RIGHT,
					className: 'toast-error'
				})
			}
			else if (searchTerm === data[0].username)
			{
				navigate(`/profiles/${searchTerm}`); //add the right url with the username of the person found
			}
			else
			{
				toast.error("User not found", {
					position: toast.POSITION.BOTTOM_RIGHT,
					className: 'toast-error'
				})
			}
		}
		else
		{
			for (let i = 0; i < data.message.length; i++)
			{
				toast.error(data.message[i], {
					position: toast.POSITION.BOTTOM_RIGHT,
					className: 'toast-error'
				})
			}
		}
	}

	const handleInputChange = (value: string) => {
		setSearchTerm(value);
	};

	useEffect(()=>{
		const handleKeyPress = (e: KeyboardEvent) => {
			switch (e.key) {
			  case "Enter":
				if (document !== null && document.getElementById("subButton") !== null)
				  document.getElementById("subButton")?.click();
				break;
			  default:
				break;
			}
		  };
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	},[])



return (
	<div>
	<InputGroup size='sm' placeholder='Search'>
	<InputRightElement  width='-2.5rem'>
	<Input focusBorderColor='black' variant='outline' className='search'
        placeholder='Search'
		_placeholder={{ opacity: 1, color: 'black' }}
		value={searchTerm}
		onChange={(e) => handleInputChange(e.target.value)}
      />
	<button id="subButton" className='login-button2' type="submit" onClick={handleSearch}>Submit</button>
	</InputRightElement>
	</InputGroup>
	</div>
)
}
export default Searchbar
