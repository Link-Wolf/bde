import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { LoggerModule } from '../logger/logger.module';
import { StudModule } from '../stud/stud.module';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';
import { ContributionModule } from '../contribution/contribution.module';

@Module({
	imports: [LoggerModule, StudModule, EventModule, ContributionModule],
	controllers: [InscriptionController],
	providers: [InscriptionService]
})
export class InscriptionModule { }
