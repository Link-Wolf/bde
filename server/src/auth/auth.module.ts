import { Module, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StudModule } from '../stud/stud.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		StudModule, HttpModule.register({
			timeout: 5000,
			maxRedirects: 5,
		}),
		PassportModule,
		JwtModule.register({
			secret: "secretKey",//TODO: replace with config.json
			signOptions: { expiresIn: '7 days' }
		})],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
	controllers: [AuthController]
})
export class AuthModule { }
