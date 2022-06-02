import { Module } from '@nestjs/common';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';
import { InscriptionController } from './inscription.controller';

@Module({
  controllers: [InscriptionController],
  providers: [InscriptionService]
})
export class InscriptionModule {}
