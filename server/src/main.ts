import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import helmet from 'helmet';
import * as compression from 'compression';
//import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session';
const express = require('express');
const server = express();
let RedisStore = require("connect-redis")(session)

const spdyNest = require('spdy-nest');

async function bootstrap() {
	const { createClient } = require("redis")
	let redisClient = createClient({
		legacyMode: true, socket: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_POST,
		}, password: process.env.REDIS_PASSWORD
	})
	redisClient.connect().catch(console.error)
	redisClient.on("error", console.error)


	const app = await NestFactory.create(AppModule,
		{
			logger: ['debug']
		});
	app.use(
		compression(),
		helmet(),
		// csurf(),
		cookieParser("hi this is the secret"),
		session(
			{
				store: new RedisStore({ client: redisClient }),
				secret: process.env.REDIS_CRYPT_KEY,
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
		"origin": process.env.APP_URL,
		"methods": "GET,PUT,PATCH,POST,DELETE",
		"preflightContinue": false,
		"optionsSuccessStatus": 204,
		"credentials": true,
	})
	await app.listen(4242);

}
bootstrap();
