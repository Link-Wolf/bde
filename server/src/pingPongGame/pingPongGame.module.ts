import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PingPongGame } from '../entity/PingPongGame';
import { PingPongGameController } from './pingPongGame.controller';
import { PingPongGameService } from './pingPongGame.service';
import { LoggerModule } from '../logger/logger.module';
import { StudModule } from '../stud/stud.module';
@Module(
{
	  imports: [TypeOrmModule.forFeature([PingPongGame]), StudModule, LoggerModule],
	  controllers: [PingPongGameController],
	  providers: [PingPongGameService],
	  exports: [PingPongGameService]
})
export class PingPongGameModule { }