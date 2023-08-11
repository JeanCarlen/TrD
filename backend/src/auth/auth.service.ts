import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Make sure the import path is correct

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginData: { username: string; password: string }): Promise<boolean> {
    // Implement your authentication logic here
    // Check the username and password against the database using the userService
    // Return true if authenticated, otherwise return false

    // Example (replace with your actual logic):
    return true;
  }
}
