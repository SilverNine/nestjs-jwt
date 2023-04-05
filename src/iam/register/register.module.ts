import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailerModule],
  controllers: [RegisterController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    RegisterService,
    UsersService,
  ],
})
export class RegisterModule {}
