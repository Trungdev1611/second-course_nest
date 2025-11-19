# Hướng dẫn chạy Project

## Cấu trúc Project

```
second-course_nest/
├── src/              # Backend (NestJS) - Port 3000
└── frontend/         # Frontend (Next.js) - Port 3001
```

## Cách chạy

### Option 1: Chạy riêng biệt (Khuyến nghị)

#### Terminal 1 - Backend (NestJS)
```bash
# Ở thư mục root
npm run start:dev
# Hoặc
npm run start:dev

# Backend sẽ chạy tại: http://localhost:3000
# Swagger docs: http://localhost:3000/api/docs
```

#### Terminal 2 - Frontend (Next.js)
```bash
# Vào thư mục frontend
cd frontend
npm install  # Chỉ cần chạy lần đầu
npm run dev

# Frontend sẽ chạy tại: http://localhost:3001
```

### Option 2: Chạy cả hai cùng lúc (với concurrently)

Script đã được thêm vào `package.json` ở root. Chỉ cần:

```bash
# Cài concurrently (chỉ cần 1 lần)
npm install --save-dev concurrently

# Chạy cả backend và frontend cùng lúc
npm run dev:all
```

Hoặc chạy riêng:
```bash
npm run dev:frontend  # Chỉ chạy frontend
```

## Ports

- **Backend (NestJS)**: `http://localhost:3000`
- **Frontend (Next.js)**: `http://localhost:3001`
- **Swagger API Docs**: `http://localhost:3000/api/docs`

## Environment Variables

### Backend
Tạo file `.env` ở root (nếu chưa có):
```env
PORT=3000
PORT_DB=3336
DOMAIN=localhost:3000
# ... các biến khác
```

### Frontend
File `.env.local` đã được tạo trong `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Kiểm tra

1. **Backend**: Mở http://localhost:3000/api/docs - Thấy Swagger UI
2. **Frontend**: Mở http://localhost:3001 - Thấy Component Demo Page

## Troubleshooting

### Port đã được sử dụng
```bash
# Kiểm tra port đang dùng
lsof -i :3000
lsof -i :3001

# Kill process nếu cần
kill -9 <PID>
```

### Frontend không kết nối được Backend
- Kiểm tra Backend đã chạy chưa
- Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
- Kiểm tra CORS settings trong Backend (nếu có)

### Lỗi dependencies
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

