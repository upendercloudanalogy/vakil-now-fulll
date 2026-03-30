import { Test, TestingModule } from '@nestjs/testing';
import { SupportComplaintsController } from './support-complaints.controller';

describe('SupportComplaintsController', () => {
  let controller: SupportComplaintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportComplaintsController],
    }).compile();

    controller = module.get<SupportComplaintsController>(SupportComplaintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
