import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) { }

	findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

	findOne(login: string): Promise<User> {
		return this.usersRepository.findOneBy({ login: login });
	}

	async create(user: User): Promise<void> {
		this.usersRepository.save(user);
	}

	async remove(login: string): Promise<void> {
		await this.usersRepository.delete({ login: login });
	}
}
