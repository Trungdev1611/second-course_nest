# Data Scripts

Folder này chứa các scripts để generate và quản lý dữ liệu.

## Các scripts có sẵn:

### 1. `generate-friendship-mockdata.ts`
Tạo dữ liệu friendship giữa các users.

**Usage:**
```bash
npm run seed:friendship
# hoặc với số lượng tùy chỉnh
ts-node -r tsconfig-paths/register src/scripts/generate-friendship-mockdata.ts 500
```

### 2. `generate-blog-performance-data.ts`
Tạo dữ liệu test performance cho blogs (đã có sẵn trong src/scripts).

**Usage:**
```bash
npm run seed:blog-performance
# hoặc với tùy chỉnh
ts-node -r tsconfig-paths/register src/scripts/generate-blog-performance-data.ts [userCount] [blogCount] [tagCount]
```

### 3. `update-blogs-content.ts`
Cập nhật content cho blogs.

**Usage:**
```bash
npm run update:blogs
```

## Lưu ý:

- Các scripts này có thể chạy độc lập hoặc kết hợp với seeds
- Đảm bảo đã có users và blogs trước khi chạy friendship và comments scripts

