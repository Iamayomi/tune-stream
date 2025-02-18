import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

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
                        type: 'nested', // ✅ FIXED! Tracks are objects, not keywords.
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
                      password: { type: 'keyword' }, // You might not want to store passwords in Elasticsearch
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

  async searchSongs(
    query: string,
    filters: any,
    sortBy: 'popularity' | 'releaseDate',
    order: 'asc' | 'desc',
    page = 1,
    limit = 10,
  ) {
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
      sort: [{ [sortBy]: { order } }],
      from: (page - 1) * limit,
      size: limit,
    };

    if (filters.genre)
      body.query.bool.filter.push({
        term: { 'genre.keyword': filters.genre },
      });
    if (filters.artist)
      body.query.bool.filter.push({
        term: { 'artist.keyword': filters.artist },
      });

    // const { body, response } = await this.elasticSearchService.search({
    //   index: this.index,
    //   body,
    // });
    const song = await this.elasticSearchService.search({
      index: this.index,
      body,
    });
    console.log(song);
    // return {
    //   results: response.hits.hits.map((hit) => hit._source),
    //   aggregations: response.aggregations,
    // };

    return {
      results: song,
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

  //   async recommendTracks(userId: string) {
  //     const userHistory = await this.getUserListeningHistory(userId);
  //     const genres = userHistory.map((track) => track.genre);

  //     const { body } = await this.elasticsearchService.search({
  //       index: this.index,
  //       body: {
  //         query: {
  //           terms: { 'genre.keyword': genres },
  //         },
  //         size: 10,
  //       },
  //     });

  //     return body.hits.hits.map((hit) => hit._source);
  //   }

  //   private async getUserListeningHistory(userId: string) {
  //     // Fetch from database or Redis
  //     return [
  //       { id: '1', genre: 'pop' },
  //       { id: '2', genre: 'rock' },
  //     ];
  //   }

  //   async getTrendingTracks() {
  //     const { body } = await this.elasticsearchService.search({
  //       index: this.index,
  //       body: {
  //         size: 0, // No results, just aggregations
  //         aggs: {
  //           trending_tracks: {
  //             terms: { field: "title.keyword", size: 10 }
  //           },
  //           trending_artists: {
  //             terms: { field: "artist.keyword", size: 10 }
  //           },
  //           trending_genres: {
  //             terms: { field: "genre.keyword", size: 10 }
  //           }
  //         }
  //       }
  //     });

  //     return {
  //       topTracks: body.aggregations.trending_tracks.buckets,
  //       topArtists: body.aggregations.trending_artists.buckets,
  //       topGenres: body.aggregations.trending_genres.buckets
  //     };
  //   }
  //   async recommendTracks(trackId: string) {
  //     const { body } = await this.elasticsearchService.search({
  //       index: this.index,
  //       body: {
  //         query: {
  //           more_like_this: {
  //             fields: ["title", "artist", "lyrics"],
  //             like: [{ _id: trackId }],
  //             min_term_freq: 1,
  //             max_query_terms: 12
  //           }
  //         }
  //       }
  //     });

  //     return body.hits.hits.map(hit => hit._source);
  //   }

  //   await this.elasticsearchService.indices.putSettings({
  //     index: this.index,
  //     body: {
  //       index: { number_of_replicas: 2, refresh_interval: "1s" }
  //     }
  //   });

  //   async indexTrackWithVector(track: Track) {
  //     const vector = await this.generateEmbedding(track.title + " " + track.lyrics);

  //     await this.elasticsearchService.index({
  //       index: this.index,
  //       id: track.id,
  //       body: {
  //         title: track.title,
  //         artist: track.artist,
  //         genre: track.genre,
  //         lyrics: track.lyrics,
  //         embedding: vector // Store AI-generated vector
  //       }
  //     });
  //   }

  //   async recommendByVector(trackId: string) {
  //     const { body } = await this.elasticsearchService.get({
  //       index: this.index,
  //       id: trackId
  //     });

  //     const trackVector = body._source.embedding;

  //     const { body: searchResults } = await this.elasticsearchService.search({
  //       index: this.index,
  //       body: {
  //         size: 5, // Get top 5 similar tracks
  //         query: {
  //           script_score: {
  //             query: { match_all: {} },
  //             script: {
  //               source: "cosineSimilarity(params.queryVector, 'embedding') + 1.0",
  //               params: { queryVector: trackVector }
  //             }
  //           }
  //         }
  //       }
  //     });

  //     return searchResults.hits.hits.map(hit => hit._source);
  //   }

  //   async recommendBySearchHistory(userId: string) {
  //     const { body } = await this.elasticsearchService.search({
  //       index: 'user_searches',
  //       body: {
  //         query: { match: { userId } },
  //         size: 10,
  //         sort: [{ timestamp: { order: 'desc' } }]
  //       }
  //     });

  //     const recentQueries = body.hits.hits.map(hit => hit._source.query);

  //     // Find songs related to the user's last 5 searches
  //     const recommendations = await this.elasticsearchService.searchTracks(recentQueries.join(' '));

  //     return recommendations;
  //   }

  //   async logUserSearch(userId: string, query: string) {
  //     await this.elasticsearchService.index({
  //       index: 'user_searches',
  //       body: {
  //         userId,
  //         query,
  //         timestamp: new Date().toISOString()
  //       }
  //     });
  //   }
}
