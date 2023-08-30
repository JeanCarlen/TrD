import { Test, TestingModule } from '@nestjs/testing';
import { AchievmentsController } from './achievments.controller';
import { AchievmentsService } from './achievments.service';

describe('AchievmentsController', () => {
  let controller: AchievmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievmentsController],
      providers: [AchievmentsService],
    }).compile();

    controller = module.get<AchievmentsController>(AchievmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
