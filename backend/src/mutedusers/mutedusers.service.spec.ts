import { Test, TestingModule } from '@nestjs/testing';
import { MutedusersService } from './mutedusers.service';

describe('MutedusersService', () => {
  let service: MutedusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MutedusersService],
    }).compile();

    service = module.get<MutedusersService>(MutedusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
