import { chatData } from "./Chat";


export async function TranslateChat(chat: chatData, user_id: number, token: string | undefined)
{
	if (chat === undefined || user_id === undefined || token === undefined)
		return ("Error-Undefined");

	const regex = /\[1on1\]-(\d+)-(\d+)/;

	const match = chat.chat.name.match(regex);

	if (match) {
		const n1 = parseInt(match[1], 10);
		const n2 = parseInt(match[2], 10);
		let final_user = 0;

		if (n1 === user_id)
			final_user = n2;
		else if (n2 === user_id)
			final_user = n1;

		const response = await fetch(`http://10.12.2.5:8080/api/users/${final_user}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			});
			let data = await response.json();
			if (response.ok)
			{
				return (data.username as string);
			}
			else
			{
				console.log("Error fetching all matches", data);
				return ("Error");
			}
		
	} else {
		return (chat.chat.name);
	}
}