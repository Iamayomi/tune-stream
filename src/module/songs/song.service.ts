import { Injectable } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { UpdateSongDTO } from './dto/update-song-dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/module/artists/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async createSong(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;

    const artists = await this.artistRepository.findBy(songDTO.artists);
    song.artists = artists;
    return await this.songRepository.save(song);
  }

  async findSongById(id: number): Promise<Song> {
    return await this.songRepository.findOneBy({ id });
  }

  async updateSongById(id: number, updateData: UpdateSongDTO): Promise<UpdateResult> {
    return await this.songRepository.update(id, updateData);
  }

  async deleteSongById(id: number): Promise<DeleteResult> {
    return await this.songRepository.delete(id);
  }

  async findAllSong(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  async pagination(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');
    return await paginate<Song>(queryBuilder, options);
  }
}
