import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { LoggerModule } from '../logger/logger.module';
import { StudModule } from '../stud/stud.module';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';

@Module({
	imports: [LoggerModule, StudModule, EventModule],
	controllers: [InscriptionController],
	providers: [InscriptionService]
})
export class InscriptionModule { }
