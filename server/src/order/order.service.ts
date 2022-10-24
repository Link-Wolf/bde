import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/Order';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { ContributionService } from '../contribution/contribution.service';
import { StudService } from '../stud/stud.service';
import { OrderDto } from './order.dto';
import { createDecipheriv, createCipheriv } from 'crypto';
const _aes = JSON.parse(process.env.AES)

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
		due.setMonth(due.getMonth() + parseInt(process.env.CONTRIBUTION_TIME))
		return due;
	}

	async findByStud(login: string, maker: any) {
		try {
			let order = await this.orderRepository.find({
				where: { studLogin: login, isCompleted: true },
				order: { date: "DESC" }
			});
			if (!order)
				this.logger.warn(
					`Failed -> Find orders for student ${login}: orders for ${login} does not exist`, login)
			else
				this.logger.log(`Got orders for student ${login}`, login);
			return order
		} catch (err) {
			this.logger.error(`Failed -> Find orders for student ${login} on database (${err})`, maker)
			throw err
		}
	}

	async findOne(id: string, login: any) {
		try {
			let order = await this.orderRepository.findOneBy({ id: id });
			if (!order) {
				this.logger.warn(
					`Failed -> Find order with id ${id}: order ${id} does not exist`, login)
				throw new NotFoundException(`Failed to find order with id ${id}: order ${id} does not exist`)
			}
			else
				this.logger.log(`Got order ${id}`, login);
			let stud = await this.studService.findOne(order.studLogin, login)
			order.stud = stud;
			let decipher = createDecipheriv('aes-256-cbc', Buffer.from(_aes.key.data), Buffer.from(_aes.iv.data));
			order.address = Buffer.concat([
				decipher.update(Buffer.from(JSON.parse(order.address))),
				decipher.final(),
			]).toString();
			decipher = createDecipheriv('aes-256-cbc', Buffer.from(_aes.key.data), Buffer.from(_aes.iv.data));
			order.city = Buffer.concat([
				decipher.update(Buffer.from(JSON.parse(order.city))),
				decipher.final(),
			]).toString();
			return order
		}
		catch (err) {
			this.logger.error(`Failed -> Find order ${id} on database (${err})`, login)
			throw err
		}
	}

	async createOrder(body: OrderDto, login: string) {
		try {
			if (await this.orderRepository.findOneBy({ id: body.id }))
				throw new ConflictException
					(`Failed -> Create order ${body.id} : order ${body.id} already exists`);
			let cipher = createCipheriv('aes-256-cbc', Buffer.from(_aes.key.data), Buffer.from(_aes.iv.data));
			const tmp = body
			tmp.city = JSON.stringify(Buffer.concat([
				cipher.update(body.city),
				cipher.final(),
			]).toJSON().data);
			cipher = createCipheriv('aes-256-cbc', Buffer.from(_aes.key.data), Buffer.from(_aes.iv.data));
			tmp.address = JSON.stringify(Buffer.concat([
				cipher.update(body.address),
				cipher.final(),
			]).toJSON().data);
			const order = { ...tmp, date: new Date(Date.now()) }
			let ret = await this.orderRepository.save(order);
			this.logger.log(`Created order ${body.id}`, login)
			return ret
		} catch (err) {
			this.logger.error(
				`Failed -> Create order ${body.id} on database(${err})`, login);
			throw err
		}
	}

	async captureOrder(body: { id: any; }, login: string) {
		try {
			const order = await this.orderRepository.findOneBy({ id: body.id })
			if (!order)
				throw new NotFoundException
					(`Failed -> Capture order ${body.id} : order ${body.id} doesn't exist`);
			order.isCompleted = true
			await this.orderRepository.update(body.id, order);
			const stud = await this.studService.findOne(order.studLogin, login)
			const contrib = {
				stud: stud,
				cost: order.cost,
				begin_date: new Date(Date.now()),
				end_date: OrderService.due()
			};
			await this.contributionService
				.create(contrib, login);
			this.logger.log(`Captured order ${body.id}`, login)
			return {
				order: order,
				mail: stud.email
			}
		} catch (err) {
			this.logger.error(
				`Failed -> Capture order ${body.id} on database (${err})`,
				login);
			throw err
		}
	}
}
