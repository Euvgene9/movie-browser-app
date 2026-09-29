import { Module } from '@nestjs/common';
import { GenrePreferencesService } from './genre-preferences.service';
import { GenrePreferencesController } from './genre-preferences.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GenrePreferencesController],
  providers: [GenrePreferencesService],
  exports: [GenrePreferencesService],
})
export class GenrePreferencesModule { }
