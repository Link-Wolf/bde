import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Donation } from '../entity/Donation';
import { LoggerService } from '../logger/logger.service';
import { DonationDto } from './donation.dto';

@Injectable()
export class DonationService {
    constructor(
        @InjectRepository(Donation)
        private donationRepository: Repository<Donation>,
        private logger: LoggerService,
        private manager: EntityManager
    ) { }
    
    async findAll(requestMaker: string): Promise<Donation[]> {
        try {
            let donations = await this.donationRepository.find();
            this.logger.log(`Got all donations`, requestMaker);
            return donations;
        } catch (error) {
            this.logger.error(`Failed -> Get all donation on database (${error})`, requestMaker);
            throw error
        }
    }

    async findOne(id: number, requestMaker: string): Promise<any> {
        try {
            let donation = await this.donationRepository.findOneBy({ id: id });
            if (!donation) {
                this.logger.error(`Failed -> Find donation ${id} : donation does not exist`, requestMaker);
                throw new NotFoundException(`Failed to find donation with id ${id} : donation ${id} does not exist`);
            }
            this.logger.log(`Got donation ${id}`, requestMaker);
            //maybe do some stuff here like in stud or event
            return donation;
        }
        catch (error) { 
            this.logger.error(`Failed -> Find donation ${id} on database (${error})`, requestMaker);
            throw error;
        }
    }

    async create(donationData: DonationDto, requestMaker: string): Promise<any> {
        try {
            if (await this.findOne(donationData.id, requestMaker)) {
                this.logger.error(`Failed -> Create donation with id ${donationData.id} : donation ${donationData.id} already exists`, requestMaker, true);
                throw new ConflictException(`Failed to create donation with id ${donationData.id} : donation ${donationData.id} already exists`);
            }
            let donation = await this.donationRepository.save(donationData);
            this.logger.warn(`Created donation ${donation.id}`, requestMaker, true);
            return donation;
        } catch (error) {
            this.logger.error(`Failed -> Create donation on database (${error})`, requestMaker, true)
            throw error
        }
    }

    async update(id: number, donationData: DonationDto, requestMaker: string): Promise<any> {
        try {
            let donation = await this.findOne(id, requestMaker);
            if (!donation) {
                this.logger.error(`Failed -> Update donation ${id} : donation ${id} does not exist`, requestMaker, true);
                throw new NotFoundException(`Failed to update donation with id ${id} : donation ${id} does not exist`);
            }
            let ret = await this.donationRepository.update(id, donationData);
            this.logger.warn(`Updated donation ${donation.id}`, requestMaker, true);
            return ret;
        } catch (error) {
            this.logger.error(`Failed -> Update donation ${id} on database (${error})`, requestMaker, true)
            throw error;
        }
    }

    async deleteOne(id: number, requestMaker: string): Promise<any> {
        try {
            let donation = await this.findOne(id, requestMaker);
            if (!donation) {
                this.logger.error(`Failed -> Delete donation ${id} : donation ${id} does not exist`, requestMaker, true);
                throw new NotFoundException(`Failed to delete donation with id ${id} : donation ${id} does not exist`);
            }
            let ret = await this.donationRepository.delete(id);
            this.logger.warn(`Deleted donation ${donation.id}`, requestMaker, true);
            return ret;
        } catch (error) {
            this.logger.error(`Failed -> Delete donation ${id} on database (${error})`, requestMaker, true)
            throw error;
        }
    }

    async deleteAll(requestMaker: string): Promise<any> {
        try {
            let ret = await this.donationRepository.delete({});
            this.logger.warn(`Deleted all donations`, requestMaker, true);
            return ret;
        } catch (error) {
            this.logger.error(`Failed -> Delete all donations on database (${error})`, requestMaker, true)
            throw error;
        }
    }
}