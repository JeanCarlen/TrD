import { Input, Stack, Button, InputGroup, InputRightElement } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import Cookies from 'js-cookie';


function Searchbar() {
		const [searchTerm, setSearchTerm] = useState('');
		const [searchHistory, setSearchHistory] = useState<string[]>([]);
		const [suggestions, setSuggestions] = useState<string[]>([]);
		
		const token = Cookies.get('token');
		const handleSearch = async () => {
			const response = await fetch('http://localhost:8080/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer' + token
				},
				body: JSON.stringify({}),
			});
			const data = await response.json()
			if (response.ok && searchTerm)
			{
				setSearchHistory((prevHistory) => [...prevHistory, searchTerm]);
				console.log(data);
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
			setSearchTerm('');
			handleSearch();
		  }
		}

return (
	<div>
	<InputGroup size='sm' placeholder='Search'>
	<InputRightElement width='-3.5rem'>
	<Input className='search'
        // pr='1.5rem'
        // type={show ? 'text' : 'password'}
        placeholder='Search'
		value={searchTerm}
		onChange={(e) => handleInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
	</InputRightElement>
	</InputGroup>
	</div>
)
}
export default Searchbar
