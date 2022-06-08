import { Test, TestingModule } from '@nestjs/testing';
import { StudController } from './stud.controller';

describe('StudController', () => {
  let controller: StudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudController],
    }).compile();

    controller = module.get<StudController>(StudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
