import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { ValidateCredentialsUseCase } from './application/use-cases/validate-credentials.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { UserController } from './infrastructure/http/controllers/user.controller';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    CreateUserUseCase,
    ValidateCredentialsUseCase,
    ListUsersUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
  ],
  exports: [USER_REPOSITORY, CreateUserUseCase],
})
export class UsersModule {}
