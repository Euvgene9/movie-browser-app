import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenrePreferencesService } from './genre-preferences.service';
import { CreateGenrePreferenceDto } from './dto/create-genre-preference.dto';
import { UpdateGenrePreferenceDto } from './dto/update-genre-preference.dto';

@Controller('genre-preferences')
export class GenrePreferencesController {
  constructor(private readonly genrePreferencesService: GenrePreferencesService) { }

}
