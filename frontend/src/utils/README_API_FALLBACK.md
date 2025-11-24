# API Fallback System

## Tổng Quan

Hệ thống fallback tự động chuyển sang mock data khi API lỗi hoặc chưa có API, đồng thời hiển thị warning cho developer.

## Cách Hoạt Động

### 1. Khi API Thành Công
- ✅ Trả về data từ API
- ✅ Không có warning

### 2. Khi API Lỗi
- ⚠️ Tự động fallback về mock data
- ⚠️ Log warning vào console (chỉ trong dev mode)
- ⚠️ Hiển thị banner warning ở góc màn hình (chỉ trong dev mode)
- ✅ UI vẫn hoạt động bình thường với mock data

## Các API Đã Có Fallback

1. **Posts API**
   - `getPosts()` - Lấy danh sách bài viết
   - `getPostById()` - Lấy chi tiết bài viết
   - `getRelatedPosts()` - Lấy bài viết liên quan

2. **Tags API**
   - `getTags()` - Lấy danh sách tags

3. **Comments API**
   - `getComments()` - Lấy danh sách comments

## Cách Sử Dụng

### Trong Hooks

```typescript
import { withApiFallback, transformMockPostsToApiFormat } from '@/utils/apiFallback';
import { mockPosts } from '@/data/mock';

const usePosts = (params) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const mockData = transformMockPostsToApiFormat(mockPosts, params);
      return await withApiFallback(
        async () => {
          const res = await blogApi.getPosts(params);
          return res.data;
        },
        mockData,
        'getPosts' // API name for logging
      );
    },
  });
};
```

## Warning System

### Console Warnings (Dev Mode Only)
- Grouped console logs với thông tin chi tiết
- Styled console messages
- Error details và mock data preview

### Visual Indicator (Dev Mode Only)
- Banner warning ở góc dưới bên phải
- Tự động ẩn sau 15 giây
- Có thể đóng thủ công
- Hiển thị tên API bị lỗi

## Production Mode

- ⚠️ **Không hiển thị warnings** trong production
- ✅ Vẫn fallback về mock data nếu API lỗi
- ✅ UI hoạt động bình thường

## Lưu Ý

1. Mock data chỉ được sử dụng khi API thực sự lỗi
2. Trong production, nên đảm bảo API luôn hoạt động
3. Mock data được transform để match với API response format
4. Pagination và filtering cũng được áp dụng cho mock data

## Thêm Fallback Cho API Mới

1. Import utilities:
```typescript
import { withApiFallback } from '@/utils/apiFallback';
import { mockData } from '@/data/mock';
```

2. Wrap API call:
```typescript
return await withApiFallback(
  async () => {
    const res = await yourApi.call();
    return res.data;
  },
  mockData,
  'yourApiName'
);
```

3. Transform mock data nếu cần:
```typescript
import { transformMockDataToApiFormat } from '@/utils/apiFallback';
const mockData = transformMockDataToApiFormat(rawMockData, params);
```

