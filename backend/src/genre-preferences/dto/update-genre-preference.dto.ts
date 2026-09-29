import { PartialType } from '@nestjs/swagger';
import { CreateGenrePreferenceDto } from './create-genre-preference.dto';

export class UpdateGenrePreferenceDto extends PartialType(CreateGenrePreferenceDto) {}
