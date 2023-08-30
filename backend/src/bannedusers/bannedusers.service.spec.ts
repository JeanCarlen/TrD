import { Test, TestingModule } from '@nestjs/testing';
import { BannedusersService } from './bannedusers.service';

describe('BannedusersService', () => {
  let service: BannedusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BannedusersService],
    }).compile();

    service = module.get<BannedusersService>(BannedusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
