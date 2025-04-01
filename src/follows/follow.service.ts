import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/albums/album.entity';
import { Artist } from 'src/artists/artist.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { FollowAlbum, FollowArtist } from './interface';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/type';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    private notificationService: NotificationService,
  ) {}

  /**
   * Follow a artist.
   *
   * @param {number} userId - The ID of the user liking the song.
   * @param {number} artistId - The ID of the artist to be liked.
   * @returns {Promise<FollowArtist>}
   * - Returns liked song details.
   * @throws {NotFoundException} If user or artist is not found.
   * @throws {ConflictException} If the artist is already followed.
   */
  public async followArtist(
    userId: number,
    artistId: number,
  ): Promise<FollowArtist> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedArtists'],
    });

    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['followers', 'user'],
    });

    if (!user || !artist) {
      throw new NotFoundException('User or Artist not found');
    }

    // Check if already following
    const isAlreadyFollowing = user.followedArtists.some(
      (artist) => artist.id === artistId,
    );

    if (isAlreadyFollowing) {
      throw new ConflictException('Artist already followed');
    }

    // Add to followed artists
    user.followedArtists.push(artist);
    artist.followers.push(user);
    artist.totalFollowers += 1;

    // Save changes
    await this.userRepository.save(user);
    await this.artistRepository.save(artist);

    await this.followNotification(artist, `${user.fullName} just follow you`);

    return {
      artistId: artist.id,
      totalFollowers: artist.totalFollowers,
      isFollowing: true,
    };
  }

  private async followNotification(artist: Artist, message: string) {
    //  Notify Artist
    this.notificationService.createNotification({
      type: NotificationType.FRIEND_ACTIVITY,
      message,
      userId: artist.user.id,
    });
  }

  /**
   * Unfollows an artist for a given user.
   *
   * @param {number} userId - The ID of the user unfollowing the artist.
   * @param {number} artistId - The ID of the artist to unfollow.
   * @returns {Promise<FollowArtist>}
   * - Returns updated artist follow details.
   * @throws {NotFoundException} If the user or artist is not found.
   */
  public async unfollowArtist(
    userId: number,
    artistId: number,
  ): Promise<FollowArtist> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedArtists'],
    });

    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['followers'],
    });

    if (!user || !artist) {
      throw new NotFoundException('User or Artist not found');
    }

    // Remove from followed artists
    user.followedArtists = user.followedArtists.filter(
      (artist) => artist.id !== artistId,
    );
    artist.followers = artist.followers.filter((user) => user.id !== userId);
    artist.totalFollowers = Math.max(0, artist.totalFollowers - 1);

    // Save changes
    await this.userRepository.save(user);
    await this.artistRepository.save(artist);

    return {
      artistId: artist.id,
      totalFollowers: artist.totalFollowers,
      isFollowing: false,
    };
  }

  /**
   * Allows a user to follow an album.
   *
   * @param {number} userId - The ID of the user following the album.
   * @param {number} albumId - The ID of the album to be followed.
   * @returns {Promise<FollowAlbum>}
   * - Returns updated album follow details.
   * @throws {NotFoundException} If the user or album is not found.
   * @throws {ConflictException} If the album is already followed by the user.
   */
  public async followAlbum(
    userId: number,
    albumId: number,
  ): Promise<FollowAlbum> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['artist', 'followedAlbums'],
    });

    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['followers'],
    });

    if (!user || !album) {
      throw new NotFoundException('User or Album not found');
    }

    // Check if already following
    const isAlreadyFollowing = user.followedAlbums.some(
      (album) => album.id === albumId,
    );

    if (isAlreadyFollowing) {
      throw new ConflictException('Album already followed');
    }

    // Add to followed albums
    user.followedAlbums.push(album);
    album.followers.push(user);
    album.totalFollowers += 1;

    // Save changes
    await this.userRepository.save(user);
    await this.albumRepository.save(album);

    await this.followNotification(
      user.artist,
      `${user.fullName} just follow your album`,
    );

    return {
      albumId: album.id,
      totalFollowers: album.totalFollowers,
      isFollowing: true,
    };
  }

  /**
   * Allows a user to unfollow an album.
   *
   * @param {number} userId - The ID of the user unfollowing the album.
   * @param {number} albumId - The ID of the album to be unfollowed.
   * @returns {Promise<FollowAlbum>}
   * - Returns updated album follow details.
   * @throws {NotFoundException} If the user or album is not found.
   */
  public async unfollowAlbum(
    userId: number,
    albumId: number,
  ): Promise<FollowAlbum> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedAlbums'],
    });

    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['followers'],
    });

    if (!user || !album) {
      throw new NotFoundException('User or Album not found');
    }

    // Remove from followed albums
    user.followedAlbums = user.followedAlbums.filter(
      (album) => album.id !== albumId,
    );
    album.followers = album.followers.filter((user) => user.id !== userId);
    album.totalFollowers = Math.max(0, album.totalFollowers - 1);

    // Save changes
    await this.userRepository.save(user);
    await this.albumRepository.save(album);

    return {
      albumId: album.id,
      totalFollowers: album.totalFollowers,
      isFollowing: false,
    };
  }

  /**
   * Retrieves a list of artists followed by a specific user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Artist[]>} - A list of followed artists.
   * @throws {NotFoundException} If the user is not found.
   */
  public async getUserFollowedArtists(userId: number): Promise<Artist[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedArtists'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.followedArtists;
  }

  /**
   * Retrieves a list of albums followed by a specific user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Album[]>} - A list of followed albums.
   * @throws {NotFoundException} If the user is not found.
   */
  public async getUserFollowedAlbums(userId: number): Promise<Album[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedAlbums'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.followedAlbums;
  }

  /**
   * Checks if a user is following a specific artist.
   *
   * @param {number} userId - The ID of the user.
   * @param {number} artistId - The ID of the artist.
   * @returns {Promise<Partial<FollowArtist>>}
   * - An object containing the artist ID and follow status.
   * @throws {NotFoundException} If the user is not found.
   */
  public async checkArtistFollowStatus(
    userId: number,
    artistId: number,
  ): Promise<Partial<FollowArtist>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedArtists'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isFollowing = user.followedArtists.some(
      (artist) => artist.id === artistId,
    );

    return {
      artistId,
      isFollowing,
    };
  }

  /**
   * Checks if a user is following a specific album.
   *
   * @param {number} userId - The ID of the user.
   * @param {number} albumId - The ID of the album.
   * @returns {Promise<Partial<FollowArtist>>}
   * - An object containing the album ID and follow status.
   * @throws {NotFoundException} If the user is not found.
   */
  public async checkAlbumFollowStatus(
    userId: number,
    albumId: number,
  ): Promise<Partial<FollowAlbum>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followedAlbums'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isFollowing = user.followedAlbums.some(
      (album) => album.id === albumId,
    );

    return {
      albumId,
      isFollowing,
    };
  }
}
