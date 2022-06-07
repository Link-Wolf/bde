import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { User } from '../entity/User';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { UserDtoValidationPipe } from './user.pipe';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) { }

	@Get()
	findAll(): Promise<User[]> {
		return this.userService.findAll();
	}

	@Get(':login')
	findOne(@Param('login') login: string): Promise<User> {
		return this.userService.findOne(login);
	}

	@Post()
	create(@Body(new UserDtoValidationPipe()) user: UserDto) {
		this.userService.create(user);
	}

	@Patch(':login')
	update(@Param('login') login: string, @Body(new UserDtoValidationPipe()) user: UserDto) {
		this.userService.update(login, user);
	}

	@Delete(':login')
	removeOne(@Param('login') login: string) {
		this.userService.removeOne(login);
	}

	@Delete()
	removeAll() {
		this.userService.removeAll();
	}
}
