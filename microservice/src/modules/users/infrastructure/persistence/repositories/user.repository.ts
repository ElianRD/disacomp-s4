import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserPersistenceMapper } from '../mappers/user-persistence.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const orm = UserPersistenceMapper.toOrm(user);
    const saved = await this.repo.save(orm);
    return UserPersistenceMapper.toDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { email } });
    if (!orm) return null;
    return UserPersistenceMapper.toDomain(orm);
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { id } });
    if (!orm) return null;
    return UserPersistenceMapper.toDomain(orm);
  }

  async findAll(): Promise<User[]> {
    const orms = await this.repo.find();
    return orms.map(UserPersistenceMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
