import React from 'react'
import decodeToken from '../helpers/helpers'
import Cookies from 'js-cookie'

type usernameProps = {
    username: string
}

const GetUserName: React.FunctionComponent<usernameProps> = ({ username }: usernameProps) => {
    const token: string|undefined = Cookies.get("token");
    let content: {username: string, user: number, avatar: string};
    if (token !== undefined)
      content = decodeToken(token);
    else
      content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'}
    
    return (
        <div>
            <h1 className="welcome">Hello {content.username}! </h1>
        </div>
    )
}

export default GetUserName;