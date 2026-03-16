import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserApplicationMapper } from '../mappers/user-application.mapper';

@Injectable()
export class ValidateCredentialsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string, passwordRaw: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(passwordRaw, user.passwordHash);
    if (!isValid) return null;

    return UserApplicationMapper.toResponse(user);
  }
}
