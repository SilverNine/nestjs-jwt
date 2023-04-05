import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { UtilsModule } from '../../shared/utils/utils.module';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailerModule, UtilsModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ForgotPasswordService,
    UsersService,
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
