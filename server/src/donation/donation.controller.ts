import {
    Controller, Get, Post, Delete, Patch, Body, Param, ParseIntPipe, UseGuards, Session,
} from '@nestjs/common';
import { ClearanceGuard } from '../auth/clearance.guard';
import { DonationService } from './donation.service';
import { Donation } from '../entity/Donation';
import { DonationDto } from './donation.dto';
import { DonationDtoPipe } from './donation.pipe';

@Controller('donation')
export class DonationController {
    constructor(private donationService: DonationService) { }

    @Get('')
    findAll(@Session() session: Record<string, any>): Promise<Donation[]> { //must have another service to get only the few fields needed
        return this.donationService.findAll(session.login);
    }

    @Get(':id')
    findOne(@Session() session: Record<string, any>, @Param('id', ParseIntPipe) id: number): Promise<Donation> {
        return this.donationService.findOne(id, session.login);
    }

    @Post('')
    @UseGuards(new ClearanceGuard(11))
    create(
        @Session() session: Record<string, any>,
        @Body(new DonationDtoPipe()) donation: DonationDto) {
        return this.donationService.create(donation, session.login);
    }

    @Patch(':id')
    @UseGuards(new ClearanceGuard(11))
    update(
        @Session() session: Record<string, any>,
        @Param('id', ParseIntPipe) id: number,
        @Body(new DonationDtoPipe()) donation: DonationDto) {
        return this.donationService.update(id, donation, session.login);
    }

    @Delete(':id')
    @UseGuards(new ClearanceGuard(11))
    delete(
        @Session() session: Record<string, any>,
        @Param('id', ParseIntPipe) id: number) {
        return this.donationService.deleteOne(id, session.login);
    }

    @Delete('')
    @UseGuards(new ClearanceGuard(11))
    deleteAll(@Session() session: Record<string, any>) {
        return this.donationService.deleteAll(session.login);
    }
}

