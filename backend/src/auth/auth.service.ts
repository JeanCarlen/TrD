import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async login(loginData: { username: string; password: string }): Promise<boolean> {
    // Implement your authentication logic here
    // Check the username and password against the database, and return true if authenticated
    // Otherwise, return false
    return true; // For demonstration purposes, always returning true
  }
}
