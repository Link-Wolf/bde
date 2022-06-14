import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StudModule } from '../stud/stud.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
	imports: [StudModule, PassportModule],
	providers: [AuthService, LocalStrategy]
})
export class AuthModule { }
