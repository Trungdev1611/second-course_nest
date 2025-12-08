# Data Seeds

Folder này chứa tất cả các file seeds để tạo dữ liệu test cho database.

## Cấu trúc:

- `main-seed.ts` - File chính để chạy tất cả seeds
- `role.seed.ts` - Tạo roles (ADMIN, USER, EDITOR)
- `user.seed.ts` - Tạo 750 users
- `tag.seed.ts` - Tạo 750 tags
- `blog.seed.ts` - Tạo 10,000 blogs
- `comment.seed.ts` - Tạo 750 comments
- `like.seed.ts` - Tạo 750 likes
- `blog-tags.seed.ts` - Tạo relationships giữa blogs và tags

## Cách sử dụng:

### Chạy tất cả seeds:
```bash
npm run seed:all
# hoặc
ts-node -r tsconfig-paths/register data-seeds/main-seed.ts
```

### Chạy từng seed riêng:
```bash
# Chỉ roles
ts-node -r tsconfig-paths/register data-seeds/role.seed.ts

# Chỉ users (với số lượng tùy chỉnh)
ts-node -r tsconfig-paths/register -e "import('./data-seeds/user.seed').then(m => m.seedUsers(AppDataSource, 1000))"
```

## Số lượng dữ liệu mặc định:

- **Roles**: 3 (ADMIN, USER, EDITOR)
- **Users**: 750
- **Tags**: 750
- **Blogs**: 10,000 (85% published, 10% draft, 5% archived)
- **Comments**: 750 (70% top-level, 30% replies)
- **Likes**: 750 (70% cho posts, 30% cho comments)
- **Blog-Tags**: Tự động tạo (3-5 tags mỗi blog)

## Lưu ý:

1. **Thứ tự chạy quan trọng**: Roles → Users → Tags → Blogs → Blog-Tags → Comments → Likes
2. Seeds sẽ kiểm tra và chỉ tạo thêm nếu chưa đủ số lượng
3. Có thể chạy lại nhiều lần, sẽ không tạo duplicate
4. Đảm bảo database đã chạy migrations trước khi seed

