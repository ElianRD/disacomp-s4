export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public passwordHash: string,
    public role: UserRole,
    public clientId?: string,
  ) {}

  static create(props: {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    clientId?: string;
  }): User {
    if (props.role === UserRole.CLIENT && !props.clientId) {
      throw new Error('A user with CLIENT role must have a clientId');
    }
    return new User(props.id, props.email, props.passwordHash, props.role, props.clientId);
  }
}
