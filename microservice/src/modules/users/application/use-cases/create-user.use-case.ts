import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserApplicationMapper } from '../mappers/user-application.mapper';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: { email: string; passwordRaw: string; role: string; clientId?: string }): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('El usuario con este correo ya existe');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.passwordRaw, saltRounds);

    const user = User.create({
      id: uuidv4(),
      email: data.email,
      passwordHash,
      role: data.role as UserRole,
      clientId: data.clientId,
    });

    const savedUser = await this.userRepository.save(user);
    return UserApplicationMapper.toResponse(savedUser);
  }
}
