import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserApplicationMapper } from '../mappers/user-application.mapper';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, data: { role?: string; clientId?: string | null; passwordRaw?: string }): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (data.role) {
      user.role = data.role as UserRole;
    }
    
    if (user.role === UserRole.CLIENT) {
      if (data.clientId !== undefined) user.clientId = data.clientId || undefined;
    } else {
      user.clientId = undefined;
    }

    if (data.passwordRaw) {
      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(data.passwordRaw, saltRounds);
    }

    const savedUser = await this.userRepository.save(user);
    return UserApplicationMapper.toResponse(savedUser);
  }
}
