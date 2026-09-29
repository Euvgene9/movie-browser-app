import { Test, TestingModule } from '@nestjs/testing';
import { GenrePreferencesService } from './genre-preferences.service';

describe('GenrePreferencesService', () => {
  let service: GenrePreferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenrePreferencesService],
    }).compile();

    service = module.get<GenrePreferencesService>(GenrePreferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
