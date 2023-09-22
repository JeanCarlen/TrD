import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievmentsController } from './user_achievments.controller';
import { UserAchievmentsService } from './user_achievments.service';

describe('UserAchievmentsController', () => {
  let controller: UserAchievmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAchievmentsController],
      providers: [UserAchievmentsService],
    }).compile();

    controller = module.get<UserAchievmentsController>(
      UserAchievmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
