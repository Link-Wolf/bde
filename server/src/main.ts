import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import helmet from 'helmet';
//import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session';
let RedisStore = require("connect-redis")(session)

const { session_secret, url_client, _rdpw, host } = require('../config.json')

async function bootstrap() {

	const { createClient } = require("redis")
	let redisClient = createClient({
		legacyMode: true, socket: {
			host: process.env.PWD === "/server/app" ? host.docker.redis : host.local.redis,
			port: "6379",
		}, password: _rdpw
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
				proxy: true,
				cookie: {
					maxAge: 1000 * 60 * 60 * 42, //42 h
					httpOnly: true,
					sameSite: "lax",
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
		"credentials": true,
	})
	await app.listen(4242);

}
bootstrap();
