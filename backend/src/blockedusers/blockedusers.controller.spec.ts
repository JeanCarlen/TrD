import { Test, TestingModule } from '@nestjs/testing';
import { BlockedusersController } from './blockedusers.controller';
import { BlockedusersService } from './blockedusers.service';

describe('BlockedusersController', () => {
  let controller: BlockedusersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockedusersController],
      providers: [BlockedusersService],
    }).compile();

    controller = module.get<BlockedusersController>(BlockedusersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
