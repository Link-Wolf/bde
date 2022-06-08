import { Test, TestingModule } from '@nestjs/testing';
import { StudService } from './stud.service';

describe('StudService', () => {
  let service: StudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudService],
    }).compile();

    service = module.get<StudService>(StudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
