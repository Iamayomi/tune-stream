import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Album } from 'src/albums/album.entity';
import { CreateAlbumDTO } from './dto/create-album-dto';
import { Artist } from '../artists/artist.entity';
import { Song } from '../songs/song.entity';
import { UpdateAlbumDTO } from './dto/update-album-dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  public async createAlbum(
    createAlbumDto: CreateAlbumDTO,
    coverImgUrl: string,
    public_id: string,
  ): Promise<Album> {
    const { title, releaseDate, artist, genre } = createAlbumDto;

    // check if album exist
    const findAlbum = await this.albumRepository.findOne({
      where: { title, artist: { id: artist } },
    });

    if (findAlbum) {
      throw new NotFoundException(`Album has already exist`);
    }

    let album = new Album();
    album.title = title;
    album.releaseDate = releaseDate;
    album.artist = await this.artistRepository.findOneBy({
      id: artist,
    });

    album.genre = genre;
    album.coverImgUrl = coverImgUrl;

    album.imagePublicId = public_id;

    return this.albumRepository.save(album);
  }

  async findAllAlbum(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findAlbumById(albumId: number): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['tracks'],
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async updateAlbumById(
    albumId: number,
    artistId: number,
    updateAlbumData: UpdateAlbumDTO,
  ): Promise<UpdateResult> {
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['artist'],
    });

    if (!album) {
      throw new NotFoundException(`Album with this ID ${artistId} not found`);
    }
    return await this.albumRepository.update(albumId, updateAlbumData);
  }

  async deleteAlbumById(
    albumId: number,
    artistId: number,
  ): Promise<DeleteResult> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['albums'],
    });

    const album = artist.albums.find((album) => album.id === artistId);

    if (!album) {
      throw new NotFoundException(`Album with this ID ${albumId} not found`);
    }
    return await this.albumRepository.delete(albumId);
  }
}
