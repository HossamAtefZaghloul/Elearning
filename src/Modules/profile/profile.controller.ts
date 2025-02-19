import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../../Guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly ProfileService: ProfileService) {}

  // Get current user profile
  @UseGuards(AuthGuard)
  @Get()
  async getUserProfile(@Req() req: { user: { userId: string } }) {
    return this.ProfileService.getProfileByUserId(req.user.userId);
  }

  // Update profile
  @UseGuards(AuthGuard)
  @Put()
  async updateProfile(
    @Req() req: { user: { userId: string } },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.userId;
    console.log('dasdasd', userId);
    return this.ProfileService.updateProfile(userId, updateProfileDto);
  }
}
