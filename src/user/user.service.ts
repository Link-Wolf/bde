import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserDto } from './user.dto';

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

	async create(userDto: UserDto): Promise<void> {
		var user: User = {
			login: userDto.login,
			firstname: userDto.firstname,
			lastname: userDto.lastname,
			isPremium: (userDto.isPremium === '1'),
			isDirection: (userDto.isDirection === '1'),
			contributions: [],
			events: []
		}
		console.log("Trying to create user :")
		console.log(user)
		this.usersRepository.save(user);
	}

	async removeOne(login: string): Promise<void> {
		await this.usersRepository.delete({ login: login });
	}

	async removeAll(): Promise<void> {
		await this.usersRepository.delete({});
	}
}
