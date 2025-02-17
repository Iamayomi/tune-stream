import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/module/users/dto/login-user-dto';
import { UserService } from 'src/module/users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/module/artists/artist.service';
import { PayloadType } from './types/payload.type';
import { User } from 'src/module/users/user.entity';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
  ) {}

  async userLogin(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.userService.findUser(loginDTO);

    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordMatched) {
      delete user.password;

      const payload: PayloadType = { email: user.email, userId: user.id };

      const artist = await this.artistService.findArtist(payload.userId); // 2

      if (artist) {
        payload.artistId = artist.id;
      }

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }
}
