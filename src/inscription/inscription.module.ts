import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscriptionController } from './inscription.controller';
import { Inscription } from './inscription.entity';
import { InscriptionService } from './inscription.service';

@Module({
	imports: [TypeOrmModule.forFeature([Inscription])],
	controllers: [InscriptionController],
	providers: [InscriptionService]
})
export class InscriptionModule { }
