import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Album } from 'src/module/albums/album.entity';
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

  async createAlbum(createAlbumDto: CreateAlbumDTO): Promise<Album> {
    const { title, tracks, releaseDate, artist, genre, coverImage } =
      createAlbumDto;

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
    album.coverImage = coverImage;

    album = await this.albumRepository.save(album);

    album.tracks = await Promise.all(
      tracks.map(async (songDto) => {
        const artist = await this.artistRepository.findBy(songDto.artist);

        if (!artist) {
          throw new NotFoundException(`Artist for track not found`);
        }

        const song = this.songRepository.create({
          artists: artist,
          title: songDto.title,
          duration: songDto.duration,
          lyrics: songDto.lyrics,
          coverImage: songDto.coverImage,
          releaseDate,
          album,
        });

        return this.songRepository.save(song);
      }),
    );

    // Save album and songs in one operation
    return this.albumRepository.save(album);
  }

  async findAllAlbum(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findAlbumById(albumId: number): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id: albumId }, relations: ['tracks']});
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
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['artist'],
    });

    if (!album) {
      throw new NotFoundException(`Album with this ID ${artistId} not found`);
    }
    return await this.albumRepository.delete(albumId);
  }
}
