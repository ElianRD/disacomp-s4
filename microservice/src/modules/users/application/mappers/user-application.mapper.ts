import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserApplicationMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
    };
  }
}
