import { Module } from '@nestjs/common';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';

@Module({
	imports: [],
	controllers: [InscriptionController],
	providers: [InscriptionService]
})
export class InscriptionModule { }
