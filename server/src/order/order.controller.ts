import { Controller, UseGuards, Post, Session, Body, Param, Get } from '@nestjs/common';
import { ClearanceGuard } from '../auth/clearance.guard';
import { OrderDto } from "./order.dto"
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(new ClearanceGuard(7))
export class OrderController {
	constructor(private orderService: OrderService) { }

	@Get(':id')
	findOne(
		@Session() session: Record<string, any>,
		@Param('id') id: string
	) {
		return this.orderService.findOne(id, session.login)
	}

	@Post('create')
	createOrder(
		@Session() session: Record<string, any>,
		@Body() order: OrderDto
	) {
		return this.orderService.createOrder(order, session.login);
	}

	@Post('capture')
	captureOrder(
		@Session() session: Record<string, any>,
		@Body() order: { id: string }
	) {
		return this.orderService.captureOrder(order, session.login);
	}
}