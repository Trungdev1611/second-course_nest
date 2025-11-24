import { Module } from "@nestjs/common";
import { ElasticsearchModule as NestElasticSearchModule } from "@nestjs/elasticsearch";
import { ESSearchController } from "./esSearch.controller";
import { ElasticService } from "./elasticSearch.service";

@Module({
    imports: [
        NestElasticSearchModule.register({
            node: process.env.URL_ES_SEARCH || 'http://localhost:9200',
        }),
    ],
    controllers: [ESSearchController], 
    providers: [ElasticService],
    exports: [NestElasticSearchModule]
})

export class ElasticsearchModule{} 