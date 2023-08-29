import { Test, TestingModule } from '@nestjs/testing';
import { BlockedusersService } from './blockedusers.service';

describe('BlockedusersService', () => {
  let service: BlockedusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockedusersService],
    }).compile();

    service = module.get<BlockedusersService>(BlockedusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
