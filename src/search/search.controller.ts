import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ElasticSearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private elasticSearchService: ElasticSearchService) {}

  //   @Get('/search')
  //   async searchTracks(
  //     @Query('query') query: string,
  //     @Query('genre') genre?: string,
  //     @Query('artist') artist?: string,
  //     @Query('sortBy') sortBy: 'popularity' | 'releaseDate' = 'popularity',
  //     @Query('order') order: 'asc' | 'desc' = 'desc',
  //     @Query('page') page = 1,
  //     @Query('limit') limit = 10,
  //   ) {
  //     return this.elasticSearchService.searchSongs(query, { genre, artist },
  //       sortBy,
  //       order,
  //       page,
  //       limit,
  //     );
  //   }

  @Delete('/:id')
  async deleteTrack(@Param('id') id: string) {
    await this.elasticSearchService.deleteSong(id);
    return { message: 'Track deleted successfully' };
  }

  @Delete('/:index')
  async deleteIndex(@Param('index') index: string) {
    await this.elasticSearchService.deleteIndex(index);
    return { message: 'index deleted successfully' };
  }
}
