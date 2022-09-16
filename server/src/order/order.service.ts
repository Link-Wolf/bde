import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/Order';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { Contribution } from '../entity/Contribution';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order) private orderRepository: Repository<Order>,
		@InjectRepository(Contribution) private contributionRepository: Repository<Order>,
		private readonly logger: LoggerService
	) { }

	async createOrder(body, login) {
		try {
			if (await this.orderRepository.findOne(body.id))
				throw new ConflictException
					(`Failed to create order ${body.id}: already exists`);
			let ret = await this.orderRepository.save(body);
			this.logger.log(`Successfully created order ${body.id}`, login)
			return ret
		} catch (err) {
			this.logger.error(
				`Failed to create order ${body.id} on database (${err})`,
				login);
			throw err
		}
	}

	async captureOrder(body, login) {
		try {
			const order = await this.orderRepository.findOne(body.id)
			if (!order)
				throw new NotFoundException
					(`Failed to capture order ${body.id}: doesn't exist`);
			this.contributionRepository.create({ stud: order.stud, cost: order.cost });
			let ret = await this.orderRepository.update(body.id, body);
			this.logger.log(`Successfully captured order ${body.id}`, login)
			return ret
		} catch (err) {
			this.logger.error(
				`Failed to capture order on database (${err})`,
				login);
			throw err
		}
	}
}
