import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule,
		{
			logger: ['debug']
		});
<<<<<<< current
<<<<<<< HEAD
	await app.listen(4242);
=======
	await app.listen(3000);
>>>>>>> d507302333a4737cf0fd7fd0aa8f5655dac4bdaa
=======
	await app.listen(3000);
>>>>>>> before discard
}
bootstrap();
