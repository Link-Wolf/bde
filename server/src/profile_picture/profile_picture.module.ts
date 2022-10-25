import { Module } from '@nestjs/common';
import { ProfilePictureController } from './profile_picture.controller';

@Module({
  controllers: [ProfilePictureController]
})
export class ProfilePictureModule {}
