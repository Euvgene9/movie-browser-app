import { Injectable } from '@nestjs/common';
import { CreateSearchHistoryDto } from './dto/create-search-history.dto';
import { UpdateSearchHistoryDto } from './dto/update-search-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchHistoryService {
  constructor(private readonly databaseService: PrismaService) { }

  async create(userId: string, query: string) {
    const trimmed = query.trim();
    if (!trimmed) return null;
    return this.databaseService.searchHistory.create({
      data: { userId, query: trimmed },
    });
  }

  async findAll(userId: string, limit = 50) {
    return this.databaseService.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async recentQueries(userId: string, limit = 20): Promise<string[]> {
    const rows = await this.databaseService.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return [...new Set(rows.map((r) => r.query))];
  }
}
