import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule,
		{
			logger: ['debug']
		});
	app.use(helmet(), /*csurf(),*/ cookieParser("hi this is the secret"))
	app.useGlobalFilters(new HttpExceptionFilter());
	await app.listen(4242);
}
bootstrap();
