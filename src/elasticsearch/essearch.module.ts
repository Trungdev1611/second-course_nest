import { Module } from "@nestjs/common";
import { ElasticsearchModule as NestElasticSearchModule } from "@nestjs/elasticsearch";

@Module({
    imports: [
        NestElasticSearchModule.register({
            node: process.env.URL_ES_SEARCH || 'http://localhost:9200',
        })
    ],
    exports: [NestElasticSearchModule]
})

export class ElasticsearchModule{} 