import { Test, TestingModule } from '@nestjs/testing';
import { GenrePreferencesController } from './genre-preferences.controller';
import { GenrePreferencesService } from './genre-preferences.service';

describe('GenrePreferencesController', () => {
  let controller: GenrePreferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenrePreferencesController],
      providers: [GenrePreferencesService],
    }).compile();

    controller = module.get<GenrePreferencesController>(GenrePreferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
