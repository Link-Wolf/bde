import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private UserService: UserService) { }

	@Get()
	findAll(): Promise<User[]> {
		return this.UserService.findAll();
	}

	@Get(':login')
	findOne(@Param('login') login: string): Promise<User> {
		return this.UserService.findOne(login);
	}

	@Post()
	create(@Body() user: User) {
		this.UserService.create(user);
	}

	@Delete(':login')
	remove(@Param('login') login: string) {
		this.UserService.remove(login);
	}
}
