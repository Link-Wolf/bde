import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./http-exception.filter";
import helmet from "helmet";
import * as compression from "compression";
import * as session from "express-session";
let RedisStore = require("connect-redis")(session);

async function bootstrap() {
	/**
	 * REDIS SETUP - session management
	 */
	const { createClient } = require("redis");
	let redisClient = createClient({
		legacyMode: true,
		socket: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_POST,
		},
		password: process.env.REDIS_PASSWORD,
	});
	redisClient.connect().catch(console.error);
	redisClient.on("error", console.error);

	/**
	 * NESTJS SETUP
	 */
	const app = await NestFactory.create(AppModule, {
		logger: ["debug"],
	});

	/**
	 * NESTJS MIDDLEWARES
	 */
	app.use(
		compression(), //gzip
		helmet(), //security
		session({
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
		}) //session
	);
	app.useGlobalFilters(new HttpExceptionFilter()); //error handling
	app.enableCors({
		origin: process.env.APP_URL,
		methods: "GET,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
		credentials: true,
	}); //cors
	await app.listen(4242); //port
}
bootstrap();
