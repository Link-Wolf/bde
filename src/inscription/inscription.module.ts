import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscription } from '../entity/Inscription';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';

@Module({
	imports: [TypeOrmModule.forFeature([Inscription])],
	controllers: [InscriptionController],
	providers: [InscriptionService]
})
export class InscriptionModule { }
