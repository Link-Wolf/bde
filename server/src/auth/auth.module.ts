import { Module } from '@nestjs/common';
import { StudModule } from '../stud/stud.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		StudModule
	],
	providers: [AuthService],
	exports: [AuthService],
	controllers: [AuthController]
})
export class AuthModule { }
