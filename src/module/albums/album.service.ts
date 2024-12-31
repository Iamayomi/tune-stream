import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Album } from 'src/module/albums/album.entity';
import { CreateAlbumDTO } from './dto/create-album-dto';
import { Artist } from '../artists/artist.entity';
import { Song } from '../songs/song.entity';
import { ArtistsService } from '../artists/artist.service';

@Injectable()
export class AlbumService {
  constructor(
    private artistService: ArtistsService,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async createAlbum(createAlbumDto: CreateAlbumDTO): Promise<Album> {
    const album = new Album();

    album.title = createAlbumDto.title;
    album.genre = createAlbumDto.genre;
    album.coverImage = createAlbumDto.coverImage;
    album.releaseDate = createAlbumDto.releaseDate;

    const artist = await this.artistRepository.findOne({
      where: { id: createAlbumDto.artist },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    album.artist = artist;

    return await this.albumRepository.save(album);
  }

  async findAllAlbum(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findAlbumById(albumId: string): Promise<Album> {
    const album = await this.albumRepository.findOneBy({ id: albumId });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  // async updateAlbumById(albumId: string, updateAlbumDto: CreateAlbumDTO): Promise<UpdateResult> {
  //   return await this.albumRepository.update(albumId, updateAlbumDto);
  // }

  async deleteAlbumById(albumId: string): Promise<void> {
    await this.albumRepository.delete(albumId);
  }
}
