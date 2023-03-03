import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '../logger/logger.service';
import { PingPongGame } from '../entity/PingPongGame';
import { Repository, EntityManager } from 'typeorm';
import { StudService } from '../stud/stud.service';
import { Stud } from '../entity/Stud';
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

    async findAllPlayers(requestMaker: string): Promise<Stud[]> {
        try {
            let players = await this.manager.query(`SELECT DISTINCT publisher_login FROM ping_pong_game UNION SELECT DISTINCT adversary_login FROM ping_pong_game`);
            let ret = [];
            for (let i = 0; i < players.length; i++)
            {
                let player = await this.studService.findOne(players[i].publisher_login, requestMaker);
                ret.push(player);
            }
            this.logger.log(`Got all ping pong players`, requestMaker);
            return ret;
        } catch (error) {
            this.logger.error(`Failed -> Get all ping pong players on database (${error})`, requestMaker);
            throw error;
        }
    }

    async findRanking(requestMaker: string): Promise<any> {
        let players = await this.findAllPlayers(requestMaker);
        let ret = [];
        for (let i = 0; i < players.length; i++)
        {
            let player = players[i];
            let games = await this.findByPlayer(player.login, requestMaker);
            let wins = 0;
            let loses = 0;
            let total_score = 0;
            let adversaries = new Set();
            let last_match = (await this.pingPongGameRepository.find({where: [{publisher_login: player.login}, {adversary_login: player.login}], order: {date: "DESC"}, take: 1}))[0].date;
            for (let j = 0; j < games.length; j++)
            {
                let game = games[j];
                if (game.publisher_login == player.login)
                {
                    total_score += game.publisher_score;
                    adversaries.add(game.adversary_login)
                    if (game.publisher_score > game.adversary_score)
                        wins++;
                    else
                        loses++;
                }
                else
                {
                    total_score += game.adversary_score;
                    adversaries.add(game.publisher_login)
                    if (game.publisher_score > game.adversary_score)
                        loses++;
                    else
                        wins++;
                }
            }
            ret.push({login: player.login, pp: player.img_small, nb_game: wins + loses, nb_win: wins, nb_lose: loses, ratio: 100 * wins / (wins + loses), total_score: total_score, nb_adversary: adversaries.size, last_match: last_match});
        }
        ret.sort((a, b) => (b.nb_win - a.nb_win));
        return ret;
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
            if (!publisher || !adversary || publisher === undefined || adversary === undefined)
            {
                this.logger.error(`Failed -> Create ping pong game : one of the players does not exist`, requestMaker);
                throw new NotFoundException(`Failed -> Create ping pong game : one of the players does not exist`);
            }
            if (publisher.login == adversary.login)
            {
                this.logger.error(`Failed -> Create ping pong game : publisher and adversary are the same`, requestMaker);
                throw new NotAcceptableException(`Failed -> Create ping pong game : publisher and adversary are the same`);
            }
            if (pingPongGame.publisher_score < 0 
                || pingPongGame.adversary_score < 0
                || Math.max(pingPongGame.publisher_score, pingPongGame.adversary_score) < 11
                || (Math.max(pingPongGame.publisher_score, pingPongGame.adversary_score) == 11 && Math.abs(pingPongGame.publisher_score - pingPongGame.adversary_score) < 2)
                || (Math.max(pingPongGame.publisher_score, pingPongGame.adversary_score) > 11 && Math.abs(pingPongGame.publisher_score - pingPongGame.adversary_score) != 2))
            {
                this.logger.error(`Failed -> Create ping pong game : score is not valid`, requestMaker);
                throw new NotAcceptableException(`Failed -> Create ping pong game : score is not valid`);
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