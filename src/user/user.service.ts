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

	async update(login: string, userData: any): Promise<void> {
		//var old_user = await this.findOne(login);
		await this.userRepository.update(login, userData);
	}

	async create(userDto: UserDto): Promise<void> {
		await this.userRepository.save(userDto);
	}

	async removeOne(login: string): Promise<void> {
		await this.userRepository.delete({ login: login });
	}

	async removeAll(): Promise<void> {
		await this.userRepository.delete({});
	}
}
