import { Test, TestingModule } from '@nestjs/testing';
import { ChatadminsService } from './chatadmins.service';

describe('ChatadminsService', () => {
  let service: ChatadminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatadminsService],
    }).compile();

    service = module.get<ChatadminsService>(ChatadminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
