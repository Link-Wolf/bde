import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscription } from '../../dist/inscription/inscription.entity';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';

@Module({
	imports: [TypeOrmModule.forFeature([Inscription])],
	controllers: [InscriptionController],
	providers: [InscriptionService]
})
export class InscriptionModule { }
