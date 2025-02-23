import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchSongDto } from '../songs/dto/search-song-dto';

@Injectable()
export class ElasticSearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticSearchService.name);
  private readonly index = 'songs';

  //   constructor(private readonly elasticsearchService: ElasticsearchService) {}

  constructor(private readonly elasticSearchService: ElasticsearchService) {
    this.logger.log('ElasticSearchService initialized'); // Log here for debugging
  }

  async onModuleInit() {
    await this.createIndex();
  }

  async createIndex() {
    const exists = await this.elasticSearchService.indices.exists({
      index: this.index,
    });

    if (!exists) {
      this.logger.log(`Creating index: ${this.index}...`);
      await this.elasticSearchService.indices.create({
        index: this.index,
        body: {
          settings: {
            analysis: {
              filter: {
                english_stop: { type: 'stop', stopwords: '_english_' },
                english_stemmer: { type: 'stemmer', language: 'english' },
                synonym_filter: {
                  type: 'synonym',
                  synonyms: ['love, affection', 'sad, sorrow'],
                },
              },
              analyzer: {
                english_synonyms: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: [
                    'lowercase',
                    'english_stop',
                    'english_stemmer',
                    'synonym_filter',
                  ],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'integer' },
              title: { type: 'text', analyzer: 'standard' },
              releaseDate: { type: 'date' },
              duration: { type: 'text' }, // Keep as text if it's a formatted duration (e.g., "02:34:00")
              lyrics: { type: 'text', analyzer: 'english_synonyms' },
              coverImage: { type: 'keyword' },
              popularity: { type: 'integer' },

              artists: {
                type: 'nested', // Because it contains multiple artists
                properties: {
                  id: { type: 'integer' },
                  stageName: { type: 'text' },
                  songs: { type: 'keyword' }, // Array of song titles
                  albums: {
                    type: 'nested',
                    properties: {
                      id: { type: 'integer' },
                      title: { type: 'text' },
                      artist: { type: 'text' },
                      releaseDate: { type: 'date' },
                      genre: { type: 'keyword' },
                      coverImage: { type: 'keyword' },
                      tracks: {
                        type: 'nested', // Tracks are objects.
                        properties: {
                          id: { type: 'integer' },
                          title: { type: 'text' },
                          duration: { type: 'text' },
                          createdAt: { type: 'date' },
                          releaseDate: { type: 'date' },
                          coverImage: { type: 'keyword' },
                          popularity: { type: 'integer' },
                          lyrics: { type: 'text', analyzer: 'english' },
                          updatedAt: { type: 'date' },
                        },
                      }, // Array of track titles
                      createdAt: { type: 'date' },
                      updatedAt: { type: 'date' },
                    },
                  },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      firstName: { type: 'text' },
                      lastName: { type: 'text' },
                      email: { type: 'keyword' },
                      subscription: { type: 'keyword' },
                      terms_of_service: { type: 'boolean' },
                      password: { type: 'keyword' },
                      apiKey: { type: 'keyword' },
                      playlists: { type: 'keyword' }, // Array of playlist names
                      artist: { type: 'text' },
                      createdAt: { type: 'date' },
                      updatedAt: { type: 'date' },
                    },
                  },
                  createdAt: { type: 'date' },
                  updatedAt: { type: 'date' },
                },
              },

              playlists: {
                type: 'nested',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'text' },
                  userId: { type: 'integer' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      firstName: { type: 'text' },
                      lastName: { type: 'text' },
                      email: { type: 'keyword' },
                      subscription: { type: 'keyword' },
                      terms_of_service: { type: 'boolean' },
                      password: { type: 'keyword' },
                      apiKey: { type: 'keyword' },
                      playlists: { type: 'keyword' },
                      artist: { type: 'text' },
                      createdAt: { type: 'date' },
                      updatedAt: { type: 'date' },
                    },
                  },
                  songs: { type: 'keyword' },
                  createdAt: { type: 'date' },
                  updatedAt: { type: 'date' },
                },
              },

              album: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  title: { type: 'text' },
                  artist: { type: 'text' },
                  releaseDate: { type: 'date' },
                  genre: { type: 'keyword' },
                  coverImage: { type: 'keyword' },
                  tracks: {
                    type: 'nested', // Tracks are objects, not keywords.
                    properties: {
                      id: { type: 'integer' },
                      title: { type: 'text' },
                      duration: { type: 'text' },
                      createdAt: { type: 'date' },
                      releaseDate: { type: 'date' },
                      coverImage: { type: 'keyword' },
                      popularity: { type: 'integer' },
                      lyrics: { type: 'text', analyzer: 'english' },
                      updatedAt: { type: 'date' },
                    },
                  },
                  createdAt: { type: 'date' },
                  updatedAt: { type: 'date' },
                },
              },

              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });
      this.logger.log(`Index "${this.index}" created successfully.`);
    } else {
      this.logger.log(`Index "${this.index}" already exists.`);
    }
  }

  async indexDocument(index: string, id: string, document: any): Promise<void> {
    await this.elasticSearchService.index({
      index,
      id,
      body: document,
    });
    this.logger.log(`Indexed track: ${id}`);
  }

  async searchsong(searchSongDto: SearchSongDto) {
    const {
      query,
      filters,
      sortBy,
      order = 'desc',
      page = 1,
      limit = 10,
    } = searchSongDto;

    // if (!query || typeof query !== 'string') {
    //   throw new BadRequestException('Query must be a non-empty string');
    // }

    const body: any = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^3', 'artist^2', 'album', 'lyrics'],
                fuzziness: 'AUTO',
              },
            },
          ],
          filter: [],
        },
      },
      from: (page - 1) * limit,
      size: limit,
    };

    if (filters?.genre) {
      body.query.bool.filter.push({
        term: { 'genre.keyword': filters.genre },
      });
    }
    if (filters?.artist) {
      body.query.bool.filter.push({
        term: { 'artist.keyword': filters.artist },
      });
    }
    if (sortBy) {
      body.sort = [{ [sortBy]: { order } }];
    }

    const songs = await this.elasticSearchService.search({
      index: this.index,
      body,
    });

    return {
      success: true,
      results: songs.hits.hits.map((hit) => hit._source),
    };
  }

  async updateSong(songId: string, updateData: any) {
    await this.elasticSearchService.update({
      index: this.index,
      id: songId,
      body: { doc: updateData },
    });
  }

  async deleteSong(songId: string) {
    await this.elasticSearchService.delete({
      index: this.index,
      id: songId,
    });
  }

  async deleteIndex(indexName: string) {
    await this.elasticSearchService.indices.delete({
      index: indexName,
    });
  }
}
