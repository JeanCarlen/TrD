import { Injectable } from '@nestjs/common';

import { Login } from './login.model';

@Injectable()
export class LoginService{
	logins: Login[] = [];

	insertLogin(username: string, password: string){
		const loginCreation = new Date().toString();
		const newLogin = new Login(username, password, loginCreation);
		this.logins.push(newLogin);
		return loginCreation;
	}
}