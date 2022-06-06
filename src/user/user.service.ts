import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) { }

	findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	findOne(login: string): Promise<User> {
		return this.userRepository.findOneBy({ login: login });
	}

	async create(userDto: UserDto): Promise<void> {
		var user: User = {
			login: userDto.login,
			firstname: userDto.firstname,
			lastname: userDto.lastname,
			isPremium: (userDto.isPremium === '1'),
			isDirection: (userDto.isDirection === '1'),
			contributions: [],
			inscriptions: []
		}
		console.log("Create the user :")
		console.log(user)
		await this.userRepository.save(user);
	}

	async removeOne(login: string): Promise<void> {
		await this.userRepository.delete({ login: login });
	}

	async removeAll(): Promise<void> {
		await this.userRepository.delete({});
	}
}
