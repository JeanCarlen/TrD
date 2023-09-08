import { Input, Stack, Button, InputGroup, InputRightElement } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client';
import { useState } from 'react';


function Searchbar() {
		const [searchTerm, setSearchTerm] = useState('');
		const [searchHistory, setSearchHistory] = useState<string[]>([]);
		const [suggestions, setSuggestions] = useState<string[]>([]);
		const handleSearch = () => {
			if (searchTerm)
				setSearchHistory((prevHistory) => [...prevHistory, searchTerm]);
		  // Implement your search logic here using the `searchTerm`
		  console.log(`Searching for: ${searchTerm}`);
		};

		const handleInputChange = (value: string) => {
			setSearchTerm(value);

			const filteredSuggestions = ['apple', 'banana', 'cherry', 'date'].filter(
			  (suggestion) =>
				suggestion.toLowerCase().includes(value.toLowerCase())
			);

			setSuggestions(filteredSuggestions);
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
        onBlur={() => setSuggestions([])}
        onKeyPress={handleKeyPress}
      />
	</InputRightElement>
	</InputGroup>
	</div>
)
}
export default Searchbar
