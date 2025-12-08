# 🚀 Hướng dẫn chạy Backend Local với Docker Containers

## Cách chạy Backend NestJS local với 3 containers (PostgreSQL, Redis, Elasticsearch)

### 1️⃣ Khởi động 3 containers:

```bash
docker-compose up -d postgres redis elasticsearch
```

Hoặc chạy từng cái:
```bash
docker-compose up -d postgres
docker-compose up -d redis  
docker-compose up -d elasticsearch
```

### 2️⃣ Kiểm tra containers đang chạy:

```bash
docker-compose ps
```

Hoặc:
```bash
docker ps | grep second-course-nest
```

### 3️⃣ Cấu hình .env cho Backend Local:

Trong file `.env`, đảm bảo các biến sau dùng `localhost` (không phải tên service):

```env
# Database - dùng localhost vì backend chạy local
DB_HOST=localhost
DB_PORT=5432
PORT_DB=3336  # Port trên host machine (3336:5432 trong docker-compose)
DB_USERNAME=postgres
DB_PASSWORD=mysecretpassword
DB_DATABASE=fullstack

# Redis - dùng localhost
REDIS_URL=redis://localhost:6379

# Elasticsearch - dùng localhost
URL_ES_SEARCH=http://localhost:9200

# Các biến khác...
PORT=3000
NODE_ENV=development
# ... các biến khác
```

### 4️⃣ Chạy Backend Local:

```bash
npm run start:dev
```

Hoặc:
```bash
npm run start
```

### 5️⃣ Kiểm tra kết nối:

- ✅ Backend API: http://localhost:3000
- ✅ PostgreSQL: `psql -h localhost -p 3336 -U postgres -d fullstack`
- ✅ Redis: `redis-cli -h localhost -p 6379`
- ✅ Elasticsearch: http://localhost:9200

### 6️⃣ Dừng containers (khi cần):

```bash
docker-compose stop postgres redis elasticsearch
```

Hoặc dừng tất cả:
```bash
docker-compose stop
```

---

## 📝 Lưu ý:

1. **Ports mapping:**
   - PostgreSQL: `3336:5432` → Backend local dùng `localhost:3336`
   - Redis: `6379:6379` → Backend local dùng `localhost:6379`
   - Elasticsearch: `9200:9200` → Backend local dùng `http://localhost:9200`

2. **Khác biệt với Docker Backend:**
   - Khi backend chạy trong Docker: dùng tên service (`postgres`, `redis`, `elasticsearch`)
   - Khi backend chạy local: dùng `localhost` với ports trên host

3. **Code đã tự động hỗ trợ:**
   - `db.config.ts`: Đã có fallback `localhost` và port `3336`
   - `redis.service.ts`: Đã có fallback `redis://localhost:6379`
   - `essearch.module.ts`: Đã có fallback `http://localhost:9200`

4. **Lợi ích:**
   - ✅ Hot reload nhanh hơn (không cần rebuild Docker image)
   - ✅ Debug dễ dàng hơn
   - ✅ Không tốn tài nguyên cho backend container
   - ✅ Vẫn dùng được Docker cho database/services

---

## 🔄 Chuyển đổi giữa Local và Docker Backend:

### Chạy Backend trong Docker:
```bash
docker-compose up -d  # Chạy tất cả bao gồm backend
```

Trong `.env`:
```env
DB_HOST=postgres          # Tên service trong Docker network
REDIS_URL=redis://redis:6379
URL_ES_SEARCH=http://elasticsearch:9200
```

### Chạy Backend Local:
```bash
docker-compose up -d postgres redis elasticsearch  # Chỉ 3 services
npm run start:dev  # Chạy backend local
```

Trong `.env`:
```env
DB_HOST=localhost
REDIS_URL=redis://localhost:6379
URL_ES_SEARCH=http://localhost:9200
```



