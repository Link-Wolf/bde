import { Module } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { ContributionController } from './contribution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from '../entity/Contribution';
import { UserModule } from '../user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Contribution]), UserModule],
	providers: [ContributionService],
	controllers: [ContributionController]
})
export class ContributionModule { }
