import { Input, Stack, Button, InputGroup, InputRightElement } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import Cookies from 'js-cookie';
import '../pages/Users.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Searchbar() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [searchHistory, setSearchHistory] = useState<string[]>([]);
	const [suggestions, setSuggestions] = useState<string[]>([]);

	const token = Cookies.get('token');
	const handleSearch = async () => {
		const response = await fetch(`http://localhost:8080/api/users/username/${searchTerm}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
		});
		const data = await response.json()
		if (response.ok && searchTerm)
		{
			if (searchTerm === data[0].username)
			{
				console.log(data);
				const userID = data[0].id;
				navigate(`/profiles/${searchTerm}`); //add the right url with the username of the person found
			}
			// setSearchHistory((prevHistory) => [...prevHistory, searchTerm]);

		}
		else
		{
			console.log('error');
			for (let i = 0; i < data.message.length; i++)
			{
				toast.error(data.message[i], {
					position: toast.POSITION.BOTTOM_RIGHT,
					className: 'toast-error'
				})
			}
		}
		//   Implement your search logic here using the `searchTerm`
		console.log(`Searching for: ${searchTerm}`);

	}

	const handleInputChange = (value: string) => {
		setSearchTerm(value);
		};
	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
		// When Enter key is pressed, trigger the search action
		handleSearch();
		setSearchTerm('');
		}
	}

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
	<button className='login-button2' type="submit" onClick={handleSearch}>Submit</button> :
	</InputRightElement>
	</InputGroup>
	</div>
)
}
export default Searchbar
