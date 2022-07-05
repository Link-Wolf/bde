import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StudModule } from '../stud/stud.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
	imports: [
		StudModule,
		PassportModule,
		JwtModule.register({
			secret: "secretKey",//TODO: replace with config.json
			signOptions: { expiresIn: '24h' }
		})],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService]
})
export class AuthModule { }
