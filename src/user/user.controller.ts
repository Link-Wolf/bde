import { Body, Controller, Delete, Get, Param, ParseBoolPipe, Post, ValidationPipe } from '@nestjs/common';
import { User } from '../entity/User';
import { UserDto } from './user.dto';
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
	create(@Body() user: UserDto) {
		this.UserService.create(user);
	}

	@Delete(':login')
	remove(@Param('login') login: string) {
		this.UserService.remove(login);
	}
}
