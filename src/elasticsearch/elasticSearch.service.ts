import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface BlogDocument {
    title: string;
    content: string;
    excerpt?: string;
    status: string;
    tags: string[];
}

/**
 * Transform Elasticsearch hit về format PostItemProps
 */
function transformElasticsearchHitToPostItem(hit: any) {
    const source = hit._source || {};
    
    return {
        // ID fields
        blog_id: parseInt(hit._id) || source.id,
        id: parseInt(hit._id) || source.id,
        
        // Title fields
        blog_title: source.title,
        title: source.title,
        
        // Content fields
        blog_content: source.content,
        content: source.content,
        
        // Thumbnail
        blog_thumbnail: source.thumbnail,
        thumbnail: source.thumbnail,
        
        // Date
        blog_created_at: source.created_at,
        created_at: source.created_at,
        
        // Stats
        blog_views: source.views || 0,
        views: source.views || 0,
        blog_likes: source.likes || 0,
        likes: source.likes || 0,
        comment_count: source.comment_count || 0,
        
        // Tags - format đúng: Array<{ id: number; name: string }>
        tags: Array.isArray(source.tags) 
            ? source.tags.map((tag: any) => ({
                id: tag.id || 0,
                name: tag.name || tag.tag_name || ''
            }))
            : [],
        
        // User info (có thể không có trong ES)
        user_name: source.user_name || source.user?.name,
        user_email: source.user_email || source.user?.email,
        
        // Status
        status: source.status,
        
        // Highlight từ Elasticsearch
        highlight: hit.highlight ?? null,
        
        // Score từ Elasticsearch
        score: hit._score,
    };
}

@Injectable()
export class ElasticService {
    constructor(private readonly elasticService: ElasticsearchService) {

    }

    async fullTextSearchBlog({ text, status, tags, page = 1, limit = 10 }) {
        const mustQuery = [];

        // fulltext search với fuzzy search để hỗ trợ typo tolerance
        if (text) {
            mustQuery.push({
                multi_match: {
                    query: text,
                    fields: ['title^3', 'content', 'excerpt^2'], // Boost title cao hơn
                    fuzziness: 'AUTO', // Tự động cho phép 1-2 ký tự sai (fuzzy search)
                    operator: 'or', // Tìm các từ riêng lẻ (or) thay vì phải có tất cả (and)
                    type: 'best_fields' // Tìm trong field tốt nhất
                }
            })
        }

        // status filter
        if (status) {
            mustQuery.push({
                term: {
                    status,
                },
            });
        }

        // tags filter: document phải chứa tất cả tags
        if (tags?.length) {
            tags.forEach((tag: string) => {
                mustQuery.push({
                    term: { tags: tag },
                });
            });
        }

        // 4. Pagination
        const from = (page - 1) * limit;

        const result = await this.elasticService.search<BlogDocument>({
            index: 'blogs',
            from,
            size: limit,
            query: {
                bool: { must: mustQuery },
            },
            highlight: {
                fields: {
                    title: {},
                    content: {},
                    excerpt: {},
                },
                pre_tags: ['<mark>'],
                post_tags: ['</mark>'],
            },
        });

        const total =
            typeof result.hits.total === 'number'
                ? result.hits.total
                : result.hits.total.value;

        // Map hits thành data array với format đúng cho PostItemProps
        const data = result.hits.hits.map(hit => transformElasticsearchHitToPostItem(hit));

        // Trả về format { data, metadata } để match với TransformResponseInterceptor
        // Interceptor sẽ wrap thành: { status: "success", meta: metadata, data: data }
        return {
            data,
            metadata: {
                page,
                per_page: limit,
                total: total,
                totalPages: Math.ceil(total / limit),
            }
        };

    }

    async suggestionBlog(keyword: string) {
        try {
            if (!keyword || keyword.trim().length === 0) {
                return [];
            }

            const result = await this.elasticService.search({
                index: 'blogs',
                suggest: {
                    keyword_suggest: {
                        prefix: keyword.toLowerCase().trim(),
                        completion: {
                            field: 'suggest',
                            fuzzy: { 
                                fuzziness: 1, // Giảm từ 2 xuống 1 để chính xác hơn
                                min_length: 2
                            },
                            size: 10 // Giới hạn số lượng suggestions
                        }
                    }
                },
                size: 0
            });
        
            // Handle response - có thể không có suggestions
            if (result.suggest && result.suggest.keyword_suggest && result.suggest.keyword_suggest.length > 0) {
                const suggestResult = result.suggest.keyword_suggest[0];
                const options = suggestResult.options;
                
                // Đảm bảo options là array
                if (!options) {
                    return [];
                }
                
                const optionsArray = Array.isArray(options) ? options : [options];
                
                // Map suggestions để trả về format đúng
                return optionsArray.map((option: any) => {
                    // Lấy title từ _source (title của blog) thay vì text từ completion suggester
                    const title = option._source?.title || option.text || '';
                    const id = option._id || option._source?.id;
                    
                    return {
                        text: title, // Dùng title làm text để hiển thị
                        title: title, // Thêm field title riêng
                        _id: id,
                        id: id ? parseInt(id) : undefined,
                        _source: option._source || {},
                        score: option.score || 0
                    };
                });
            }
            
            return [];
        } catch (error: any) {
            console.error('Error in suggestionBlog:', error.message);
            // Nếu lỗi do index chưa tồn tại hoặc mapping sai, trả về empty array
            if (error.meta?.body?.error?.type === 'index_not_found_exception' || 
                error.meta?.body?.error?.type === 'mapper_parsing_exception' ||
                error.meta?.body?.error?.type === 'illegal_argument_exception') {
                console.warn('Index chưa được tạo hoặc mapping chưa đúng. Vui lòng chạy setupElasticsearchIndex() và reIndexAllBlog() trước.');
                return [];
            }
            throw error;
        }
    }
}
