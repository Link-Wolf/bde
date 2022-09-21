import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/Order';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { ContributionService } from '../contribution/contribution.service';
import { StudService } from '../stud/stud.service';
const { contributionTime } = require('../../config.json')

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order)
		private orderRepository: Repository<Order>,
		private contributionService: ContributionService,
		private studService: StudService,

		private readonly logger: LoggerService
	) { }

	private static due(): Date {
		let due = new Date(Date.now())
		due.setMonth(due.getMonth() + contributionTime)
		return due;
	}

	async findOne(id: string, login: any) {
		try {
			let order = await this.orderRepository.findOneBy({ id: id });
			if (!order)
				this.logger.warn(
					`404: order ${id} doesnt exits`, login)
			else
				this.logger.log(`Got order ${id}`, login);
			let stud = await this.studService.findOne(order.studLogin, login)
			order.stud = stud
			return order
		}
		catch (err) {
			this.logger.error(`Failed to find order ${id} on database (${err})`, login)
			throw err
		}
	}

	async createOrder(body, login) {
		try {
			if (await this.orderRepository.findOneBy({ id: body.id }))
				throw new ConflictException
					(`Failed to create order ${body.id}: already exists`);
			let ret = await this.orderRepository.save(body);
			this.logger.log(`Successfully created order ${body.id}`, login)
			return ret
		} catch (err) {
			console.log(body, login);
			this.logger.error(

				`Failed to create order ${body.id} on database (${err})`,
				login);
			throw err
		}
	}

	async captureOrder(body, login) {
		try {
			console.log(body)
			const order = await this.orderRepository.findOneBy({ id: body.id })
			if (!order)
				throw new NotFoundException
					(`Failed to capture order ${body.id}: doesn't exist`);
			order.isCompleted = true
			console.log(body.id, order)
			let ret = await this.orderRepository.update(body.id, order);
			const stud = await this.studService.findOne(order.studLogin, login)
			const contrib = {
				stud: stud,
				cost: order.cost,
				begin_date: new Date(Date.now()),
				end_date: OrderService.due()
			};
			await this.contributionService
				.create(contrib, login);
			this.logger.log(`Successfully captured order ${body.id}`, login)
			return {
				order: order,
				mail: stud.email
			}
		} catch (err) {
			this.logger.error(
				`Failed to capture order on database (${err})`,
				login);
			throw err
		}
	}
}
