import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IUsers } from './interfaces/users.interface';
import { UserDto } from './dto/user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { HashingService } from '../shared/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email: email,
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  public async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id: +userId,
    });

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async create(userDto: UserDto): Promise<IUsers> {
    try {
      return await this.userRepository.save(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      user.password = await this.hashingService.hash(
        Math.random().toString(36).slice(-8),
      );

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      user.password = await this.hashingService.hash(password);

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateProfileUser(
    id: string,
    userProfileDto: UserProfileDto,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id: +id });
      user.name = userProfileDto.name;
      user.email = userProfileDto.email;
      user.username = userProfileDto.username;

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUser(
    id: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<UpdateResult> {
    try {
      const user = await this.userRepository.update(
        {
          id: +id,
        },
        { ...userUpdateDto },
      );

      return user;
    } catch (err) {
      throw new BadRequestException('User not updated');
    }
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
