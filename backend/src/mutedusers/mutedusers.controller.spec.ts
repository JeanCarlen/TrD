import { Test, TestingModule } from '@nestjs/testing';
import { MutedusersController } from './mutedusers.controller';
import { MutedusersService } from './mutedusers.service';

describe('MutedusersController', () => {
  let controller: MutedusersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MutedusersController],
      providers: [MutedusersService],
    }).compile();

    controller = module.get<MutedusersController>(MutedusersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
