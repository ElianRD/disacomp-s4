import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MAIN_SERVICE') private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, passwordRaw: string): Promise<any> {
    const user = await firstValueFrom(
      this.client.send('user.validate', { email, passwordRaw }),
    );
    return user; 
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, clientId: user.clientId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        clientId: user.clientId
      }
    };
  }
}
