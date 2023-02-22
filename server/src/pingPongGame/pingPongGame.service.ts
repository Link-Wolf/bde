import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '../logger/logger.service';
import { PingPongGame } from '../entity/PingPongGame';
import { Repository, EntityManager } from 'typeorm';
import { StudService } from '../stud/stud.service';
import { PingPongGameDto } from './pingPongGame.dto';
@Injectable()
export class PingPongGameService
{
    constructor(
        @InjectRepository(PingPongGame)
        private pingPongGameRepository: Repository<PingPongGame>,
        private studService: StudService,
        private logger: LoggerService,
        private manager: EntityManager
    ) { }

    async findAll(requestMaker: string): Promise<PingPongGame[]> {
        try {
            let games = await this.pingPongGameRepository.find({order: {date: "DESC"}});
            this.logger.log(`Got all ping pong games`, requestMaker);
            return games;
        } catch (error) {
            this.logger.error(`Failed -> Get all ping pong games on database (${error})`, requestMaker);
            throw error;
        }
    }

    async findById(id: number, requestMaker: string): Promise<PingPongGame[]> {
        try {
            let game = await this.pingPongGameRepository.find({where: {id: id}});
            if (!game)
                this.logger.warn(`Failed -> Get ping pong game with id ${id} : game does not exist`, requestMaker);
            else
                this.logger.log(`Got ping pong game with id ${id}`, requestMaker);
            return game;
        } catch (error) {
            this.logger.error(`Failed -> Get ping pong game with id ${id} on database (${error})`, requestMaker);
            throw error;
        }
    }

    async findByPlayer(playerLogin: string, requestMaker: string): Promise<PingPongGame[]> {
        try {
            let games = await this.pingPongGameRepository.find({where: [{publisher_login: playerLogin}, {adversary_login: playerLogin}]});
            if (!games)
                this.logger.warn(`Failed -> Get ping pong games of player ${playerLogin} : player does not have any game`, requestMaker);
            else
                this.logger.log(`Got ping pong games of player ${playerLogin}`, requestMaker);
            return games;
        } catch (error) {
            this.logger.error(`Failed -> Get ping pong games of player ${playerLogin} on database (${error})`, requestMaker);
            throw error;
        }
    }

    async create(pingPongGame: PingPongGameDto, requestMaker: string): Promise<PingPongGame> {
        try {
            let publisher = await this.studService.findOne(pingPongGame.publisher_login, requestMaker);
            let adversary = await this.studService.findOne(pingPongGame.adversary_login, requestMaker);
            if (publisher.login == adversary.login)
            {
                this.logger.error(`Failed -> Create ping pong game : publisher and adversary are the same`, requestMaker);
                throw new NotAcceptableException(`Failed -> Create ping pong game : publisher and adversary are the same`);
            }
            if (!publisher || !adversary)
            {
                this.logger.error(`Failed -> Create ping pong game : one of the players does not exist`, requestMaker);
                throw new NotFoundException(`Failed -> Create ping pong game : one of the players does not exist`);
            }
            let ret = await this.pingPongGameRepository.save(pingPongGame);
            this.logger.log(`Created new ping pong game`, requestMaker);
            return ret;
        } catch (error) {
            this.logger.error(`Failed -> Create ping pong game on database (${error})`, requestMaker);
            throw error;
        }
    }

	async deleteAll(requestMaker: string): Promise<any> {
		try
		{
			let ret = await this.pingPongGameRepository.delete({});
			this.logger.warn(`Deleted all ping pong games`, requestMaker, true);
            return ret;
		}
		catch (error)
		{
			this.logger.error(`Failed -> Delete all ping pong games on database (${error})`, requestMaker);
			throw error;
		}
	}

	async deleteOne(id: number, requestMaker: string): Promise<any> {
		try
		{
			let game = await this.findById(id, requestMaker);
			if (!game)
			{
				this.logger.error(`Failed -> Delete ping pong game with id ${id} : game does not exist`, requestMaker, true);
                throw new NotFoundException(`Failed -> Delete ping pong game with id ${id} : game does not exist`);
            }
            let ret = await this.pingPongGameRepository.delete(id);
			this.logger.warn(`Failed -> Delete ping pong game with id ${id} : game does not exist`, requestMaker);
            return ret;
        }
		catch (error)
		{
			this.logger.error(`Failed -> Delete ping pong game with id ${id} on database (${error})`, requestMaker);
			throw error;
		}
	}
}