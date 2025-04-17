import { Injectable } from '@nestjs/common';
import { ArtistsService } from './artist.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UpdateMonthlyListeners {
  constructor(private readonly artistsService: ArtistsService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  private async updateMontlyListener() {
    await this.artistsService.updateMonthlyListeners();
  }
}
