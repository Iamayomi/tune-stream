import { Test, TestingModule } from '@nestjs/testing';
import { StreamProcessor } from './streaam.processor';

describe('QueueService', () => {
  let service: StreamProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamProcessor],
    }).compile();

    service = module.get<StreamProcessor>(StreamProcessor);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
