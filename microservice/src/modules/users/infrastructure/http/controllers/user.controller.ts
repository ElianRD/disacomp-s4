import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { ValidateCredentialsUseCase } from '../../../application/use-cases/validate-credentials.use-case';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';

@Controller()
export class UserController {
  constructor(
    private readonly createUserUC: CreateUserUseCase,
    private readonly validateCredentialsUC: ValidateCredentialsUseCase,
    private readonly listUsersUC: ListUsersUseCase,
    private readonly deleteUserUC: DeleteUserUseCase,
    private readonly updateUserUC: UpdateUserUseCase,
  ) {}

  @MessagePattern('user.create')
  async create(@Payload() data: { email: string; passwordRaw: string; role: string; clientId?: string }) {
    try {
      return await this.createUserUC.execute(data);
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('user.validate')
  async validate(@Payload() data: { email: string; passwordRaw: string }) {
    try {
      const user = await this.validateCredentialsUC.execute(data.email, data.passwordRaw);
      return user; // Retorna null si es invalido, o el DTO si es valido
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('user.findAll')
  async findAll() {
    try {
      return await this.listUsersUC.execute();
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('user.delete')
  async delete(@Payload() id: string) {
    try {
      await this.deleteUserUC.execute(id);
      return { success: true, message: 'Usuario eliminado' };
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('user.update')
  async update(@Payload() payload: { id: string; data: any }) {
    try {
      return await this.updateUserUC.execute(payload.id, payload.data);
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }
}
