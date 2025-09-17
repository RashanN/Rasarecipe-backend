import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, password, name, phone } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.usersRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
    });

    const savedUser = await this.usersRepository.save(user);
    
    // Remove password from returned object
    const { password: _, ...result } = savedUser;
    return result;
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<Omit<User, 'password'>> {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from returned object
    const { password: _, ...result } = user;
    return result;
  }

  async findById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from returned object
    const { password: _, ...result } = user;
    return result;
  }
}