import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import helmet from 'helmet';
//import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session';
let RedisStore = require("connect-redis")(session)

const { session_secret, url_client } = require('../config.json')

async function bootstrap() {

	const { createClient } = require("redis")
	let redisClient = createClient({
		legacyMode: true, socket: {
			port: process.env.REDIS_PORT,
			host: process.env.REDIS_HOST
		}
	})
	redisClient.connect().catch(console.error)
	redisClient.on("error", console.error)

	const app = await NestFactory.create(AppModule,
		{
			logger: ['debug']
		});
	app.use(
		helmet(),
		// csurf(),
		cookieParser("hi this is the secret"),
		session(
			{
				store: new RedisStore({ client: redisClient }),
				secret: session_secret,
				resave: false,
				saveUninitialized: true,
				cookie: {
					maxAge: 1000 * 60 * 60 * 4, //4 h
					httpOnly: true
				},
			}
		)
	)
	app.useGlobalFilters(new HttpExceptionFilter());
	app.enableCors({
		"origin": url_client,
		"methods": "GET,PUT,PATCH,POST,DELETE",
		"preflightContinue": false,
		"optionsSuccessStatus": 204,
		"credentials": true
	})
	await app.listen(4242);

}
bootstrap();
