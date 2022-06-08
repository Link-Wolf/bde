import { Module } from '@nestjs/common';
import { StudService } from './stud.service';
import { StudController } from './stud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stud } from '../entity/Stud';
import { InscriptionModule } from '../inscription/inscription.module';

@Module({
	imports: [TypeOrmModule.forFeature([Stud]), InscriptionModule],
	providers: [StudService],
	controllers: [StudController],
	exports: [StudService]
})
export class StudModule { }
