import { User, UserRole } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserPersistenceMapper {
  static toDomain(orm: UserOrmEntity): User {
    return new User(
      orm.id,
      orm.email,
      orm.passwordHash,
      orm.role as UserRole,
      orm.clientId || undefined
    );
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.email = user.email;
    orm.passwordHash = user.passwordHash;
    orm.role = user.role;
    orm.clientId = user.clientId || null as any;
    return orm;
  }
}
