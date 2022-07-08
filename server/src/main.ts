import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import helmet from 'helmet';
//import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser'
import session = require('express-session');

const { session_secret } = require('../config.json')

async function bootstrap() {
	const app = await NestFactory.create(AppModule,
		{
			logger: ['debug']
		});
	app.use(helmet(), /*csurf(),*/ cookieParser("hi this is the secret"), session(
		{
			secret: session_secret,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 600000,
				httpOnly: true
			}
		}
	))
	app.useGlobalFilters(new HttpExceptionFilter());
	app.enableCors({
		"origin": "http://k1r2p10.42mulhouse.fr:3000",
		"methods": "GET,PUT,PATCH,POST,DELETE",
		"preflightContinue": false,
		"optionsSuccessStatus": 204,
		"credentials": true
	})
	await app.listen(4242);

}
bootstrap();
