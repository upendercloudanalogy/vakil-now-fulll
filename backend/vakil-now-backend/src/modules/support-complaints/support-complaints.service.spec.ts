import { Test, TestingModule } from '@nestjs/testing';
import { SupportComplaintsService } from './support-complaints.service';

describe('SupportComplaintsService', () => {
  let service: SupportComplaintsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportComplaintsService],
    }).compile();

    service = module.get<SupportComplaintsService>(SupportComplaintsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
