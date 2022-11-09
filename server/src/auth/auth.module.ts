import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StudModule } from '../stud/stud.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		StudModule, HttpModule
	],
	providers: [AuthService],
	exports: [AuthService],
	controllers: [AuthController]
})
export class AuthModule { }
