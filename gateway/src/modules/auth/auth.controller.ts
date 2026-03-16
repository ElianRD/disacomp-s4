import { Controller, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar Sesión y Obtener Token JWT' })
  @ApiResponse({ status: 200, description: 'Token Generado' })
  @ApiResponse({ status: 401, description: 'Credenciales Inválidas' })
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    return this.authService.login(user);
  }
}
