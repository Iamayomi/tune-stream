// import { Module } from '@nestjs/common';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ElasticSearchService } from './search.service';
// import {
//   ELASTICSEARCH_NODE,
//   ELASTICSEARCH_PASSWORD,
//   ELASTICSEARCH_USERNAME,
// } from 'src/library';

// @Module({
//   imports: [
//     ConfigModule,
//     ElasticsearchModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         node: configService.get<string>(ELASTICSEARCH_NODE),
//         auth: {
//           username: configService.get<string>(ELASTICSEARCH_USERNAME),
//           password: configService.get<string>(ELASTICSEARCH_PASSWORD),
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [ElasticSearchService],
//   exports: [ElasticSearchService],
// })
// export class SearchModule {}
