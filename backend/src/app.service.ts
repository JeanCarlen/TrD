import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  @Inject(UsersService)
  private readonly usersService: UsersService;
  
  getHello(): string {
    return 'Hello World!';
  }

  updateUserImage(id: number, imageName: string) {
	return this.usersService.updateUserImage(id, imageName);
  }
}
