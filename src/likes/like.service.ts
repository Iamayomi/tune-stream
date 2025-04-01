import {
  ConflictException,
  Injectable,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { LikeSongDTO } from './dto/like.dto';
import { LikeSong } from './interface';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/type';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private notificationService: NotificationService,
  ) {}

  /**
   * Allows a user to like a song.
   *
   * @param {number} userId - The ID of the user.
   * @param {number} songId - The ID of the song.
   * @returns {Promise<Partial<LikeSong>>}
   * - An object containing the track ID, updated like count, and like status.
   * @throws {NotFoundException} If the user or song is not found.
   * @throws {ConflictException} If the user has already liked the song.
   */
  public async likeSong(
    userId: number,
    songId: number,
  ): Promise<Partial<LikeSong>> {
    // Find user and track
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedSongs'],
    });

    const song = await this.songRepository.findOne({
      where: { id: songId },
      relations: ['likedByUsers', 'artists.user'],
    });

    if (!user || !song) {
      throw new NotFoundException('User or Song not found');
    }

    // Check if already liked
    const isAlreadyLiked = user.likedSongs.some((song) => song.id === songId);

    if (isAlreadyLiked) {
      throw new ConflictException('Song already liked');
    }

    // Add to liked songs
    user.likedSongs.push(song);
    song.likedByUsers.push(user);

    // Update total likes
    song.totalLikes += 1;

    // Save changes
    await this.userRepository.save(user);
    await this.songRepository.save(song);

    await this.likeNotification(
      song,
      `${user.fullName} just like your song ${song.title} `,
    );

    return {
      trackId: song.id,
      totalLikes: song.totalLikes,
      isLiked: true,
    };
  }

  private async likeNotification(song: Song, message: string) {
    //  Notify Artist
    const arrId = song.artists.map((val) => val);

    arrId.find((artist) => {
      this.notificationService.createNotification({
        type: NotificationType.FRIEND_ACTIVITY,
        message,
        userId: artist.user.id,
      });
    });
  }

  /**
   * Allows a user to unlike a song.
   *
   * @param {number} userId - The ID of the user.
   * @param {number} songId - The ID of the song.
   * @returns {Promise<Partial<LikeSong>>}
   * - An object containing the track ID, updated like count, and like status.
   * @throws {NotFoundException} If the user or song is not found.
   * @throws {ConflictException} If the user has already liked the song.
   */
  public async unlikeSong(
    userId: number,
    songId: number,
  ): Promise<Partial<LikeSong>> {
    // Find user and song
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedSongs'],
    });

    const song = await this.songRepository.findOne({
      where: { id: songId },
      relations: ['likedByUsers'],
    });

    if (!user || !song) {
      throw new NotFoundException('User or Song not found');
    }

    // Remove from liked songs
    user.likedSongs = user.likedSongs.filter((song) => song.id !== songId);
    song.likedByUsers = song.likedByUsers.filter((user) => user.id !== userId);

    // Update total likes
    song.totalLikes = Math.max(0, song.totalLikes - 1);

    // Save changes
    await this.userRepository.save(user);
    await this.songRepository.save(song);

    return {
      songId: song.id,
      totalLikes: song.totalLikes,
      isLiked: false,
    };
  }

  /**
   * Retrieves the list of songs liked by a user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Song[]>} - A list of liked songs, including artist and album details.
   * @throws {NotFoundException} If the user is not found.
   */
  public async getUserLikedSongs(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedSongs', 'likedSongs.artists', 'likedSongs.album'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.likedSongs;
  }

  /**
   * Checks if a user has liked a specific song.
   *
   * @param {number} userId - The ID of the user.
   * @param {number} songId - The ID of the song.
   * @returns {Promise<Partial<LikeSong>>} - Indicates whether the user has liked the song.
   * @throws {NotFoundException} If the user is not found.
   */
  public async checkSongLikedStatus(
    userId: number,
    songId: number,
  ): Promise<Partial<LikeSong>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedSongs'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isLiked = user.likedSongs.some((song) => song.id === songId);

    return {
      songId,
      isLiked,
    };
  }
}
