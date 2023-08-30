import { Test, TestingModule } from '@nestjs/testing';
import { BannedusersController } from './bannedusers.controller';
import { BannedusersService } from './bannedusers.service';

describe('BannedusersController', () => {
  let controller: BannedusersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannedusersController],
      providers: [BannedusersService],
    }).compile();

    controller = module.get<BannedusersController>(BannedusersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
