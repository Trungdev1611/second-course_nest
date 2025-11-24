export class QueryESSearchBlogDTO {
    text: string //cái này để search theo các trường như content, excerpt (mô tả ngắn gon), title,
    status: 'draft' | 'published' | 'archived'
    tags: string[]
    page?: number  // ví dụ: 1, 2, 3...
    limit?: number // số item mỗi trang
}