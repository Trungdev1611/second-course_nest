import { Controller, Get, Query } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { QueryESSearchBlogDTO } from './esSearch.dto';
import { ElasticService } from './elasticSearch.service';


@Controller('essearch')
export class ESSearchController {
  constructor(private readonly esService: ElasticService) {}

  /**
   * Full-text search API
   */
  @ApiOperation({
    summary: "Fulltext search query input and filter by post type or tags",
    description: `
      Thực hiện tìm kiếm fulltext trên nhiều trường cùng lúc, không chỉ giới hạn một trường duy nhất
      hoặc phải nối nhiều câu lệnh LIKE. Kết quả có thể được phân loại theo độ liên quan (rank),
      đồng thời highlight từ khoá tìm kiếm trong nội dung trả về. Hỗ trợ filter theo loại bài viết 
      hoặc tags liên quan, giúp người dùng tìm thông tin chính xác và nhanh chóng hơn.

      Hỗ trợ phân trang thông qua các query parameter: page, limit.
    `
  })
  @ApiQuery({ name: 'text', required: false, description: 'Từ khoá tìm kiếm' })
  @ApiQuery({ name: 'status', required: false, description: 'Trạng thái bài viết: draft | published | archived' })
  @ApiQuery({ name: 'tags', required: false, description: 'Danh sách tag để lọc', type: [String] })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Số item mỗi trang', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài viết khớp với từ khoá, đã highlight từ khoá, phân trang kèm tổng số trang',
    schema: {
      example: {
        page: 1,
        limit: 10,
        total: 42,
        totalPages: 5,
        data: [
          {
            id: 'abc123',
            title: 'NestJS Elasticsearch Tutorial',
            content: 'Hướng dẫn sử dụng NestJS với Elasticsearch...',
            excerpt: 'Hướng dẫn NestJS + ES',
            status: 'published',
            tags: ['nestjs', 'elasticsearch'],
            score: 3.1,
            highlight: {
              title: ['<mark>NestJS</mark> Elasticsearch Tutorial']
            }
          }
        ]
      }
    }
  })
  @Get('fulltext-blog')
  fullTextSearch(@Query() querySearch: QueryESSearchBlogDTO) {
    const { text, status, tags, page, limit } = querySearch;
    return this.esService.fullTextSearchBlog({ text, status, tags, page, limit });
  }

  /**
   * Suggestion API
   */
  @ApiOperation({
    summary: "Gợi ý từ khoá khi user nhập input",
    description: `
      Trả về danh sách từ khoá gợi ý dựa trên input hiện tại. 
      Sử dụng để làm autocomplete khi người dùng gõ tìm kiếm.
      Hỗ trợ fuzzy search (cho phép sai 1 ký tự).
    `
  })
  @ApiQuery({ name: 'text', required: true, description: 'Từ khoá đang nhập' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách từ khoá gợi ý',
    schema: {
      example: ['nestjs', 'nextjs', 'network security basics']
    }
  })
  @Get('suggest-blog')
  suggestion(@Query() querySearch: QueryESSearchBlogDTO) {
    const keyword = querySearch.text;
    return this.esService.suggestionBlog(keyword);
  }
}
