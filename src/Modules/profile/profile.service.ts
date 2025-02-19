import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfile } from 'src/database/core/entities/user-profile.entity';
import { User } from 'src/database/core/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly ProfileRepository: Repository<UserProfile>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async getProfileByUserId(userId: string): Promise<UserProfile> {
    try {
      const profile = await this.ProfileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      if (!profile) throw new NotFoundException('Profile not found');
      return profile;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    try {
      let profile = await this.ProfileRepository.findOne({
        where: { user: { id } },
        relations: ['user'],
      });

      if (!profile) {
        const user = await this.UserRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException('User not found');
        }

        profile = this.ProfileRepository.create({ ...updateProfileDto, user });
      } else {
        Object.assign(profile, updateProfileDto);
      }

      return this.ProfileRepository.save(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}
