import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private databaseService: PrismaService) { }


  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  async create(email: string, passwordHash: string) {
    return this.databaseService.user.create({ data: { email, passwordHash } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with this id not found`);
    }

    if (updateUserDto.email !== undefined && updateUserDto.email !== user.email) {
      const existingUser = await this.databaseService.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const data: { email?: string; passwordHash?: string } = {};

    if (updateUserDto.email !== undefined) {
      data.email = updateUserDto.email;
    }

    if (updateUserDto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.databaseService.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

  }
}
