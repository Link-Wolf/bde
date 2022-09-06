import { Module, HttpModule } from '@nestjs/common';
import { StudModule } from '../stud/stud.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		StudModule, HttpModule.register({
			timeout: 5000,
			maxRedirects: 5,
		})],
	providers: [AuthService],
	exports: [AuthService],
	controllers: [AuthController]
})
export class AuthModule { }
