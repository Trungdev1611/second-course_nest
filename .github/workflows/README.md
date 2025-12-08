# GitHub Actions Workflows Documentation

Tài liệu này mô tả các GitHub Actions workflows được cấu hình cho dự án NestJS Fullstack.

## 📋 Danh sách Workflows

### 1. `01-simple-test.yml` - Simple Test Workflow
**Mục đích:** Workflow đơn giản để test cơ bản  
**Trigger:** Push và Pull Request vào bất kỳ branch nào  
**Chức năng:**
- Checkout code
- Hiển thị thông tin branch và commit

**Khi nào dùng:** Khi muốn test nhanh workflow hoặc làm ví dụ học tập

---

### 2. `02-backend-ci-cd.yml` - Backend CI/CD Pipeline
**Mục đích:** CI/CD pipeline đầy đủ cho NestJS Backend  
**Trigger:** Push/PR vào `main` hoặc `develop`  
**Jobs:**

1. **Test Job:**
   - Chạy PostgreSQL và Redis services
   - Install dependencies
   - Run linter
   - Run tests với coverage
   - Sử dụng `npm ci` (faster, more reliable)

2. **Build Job:**
   - Build Docker image với multi-stage
   - Push lên GitHub Container Registry (ghcr.io)
   - Tag images với branch name, SHA, và latest
   - Sử dụng Docker layer caching

3. **Security Scan:**
   - Scan Docker image với Trivy
   - Upload kết quả lên GitHub Security tab

**Khi nào dùng:** Mỗi khi push code backend lên main/develop

---

### 3. `03-self-hosted-deploy.yml` - Self-Hosted Deployment
**Mục đích:** Deploy lên máy local/server riêng  
**Trigger:** Push vào `main` hoặc manual trigger  
**Yêu cầu:** 
- Self-hosted runner với label `local-test-self-hosted`
- Docker đã cài đặt trên runner

**Chức năng:**
- Build Docker image
- Stop container cũ
- Deploy container mới
- Health check

**Setup Self-Hosted Runner:**
```bash
# Trên máy/server của bạn
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN
./run.sh
```

**Khi nào dùng:** Khi muốn deploy lên server riêng (VPS, local machine, etc.)

---

### 4. `04-frontend-deploy-pages.yml` - Frontend Deploy to GitHub Pages
**Mục đích:** Build và deploy Next.js frontend lên GitHub Pages  
**Trigger:** Push vào `main` hoặc manual trigger  
**Chức năng:**
- Install dependencies
- Run linter
- Run tests (nếu có)
- Build Next.js app
- Deploy lên GitHub Pages

**Lưu ý:**
- Cần enable GitHub Pages trong repo settings
- Source: GitHub Actions
- URL deploy: `https://YOUR_USERNAME.github.io/REPO_NAME/`

**Khi nào dùng:** Khi muốn deploy frontend lên GitHub Pages (free hosting)

---

### 5. `05-fullstack-docker-compose.yml` - Fullstack Docker Compose CI/CD
**Mục đích:** Test và build toàn bộ stack với Docker Compose  
**Trigger:** Push/PR vào `main` hoặc `develop`  
**Jobs:**

1. **Test với Docker Compose:**
   - Start PostgreSQL, Redis, Elasticsearch
   - Chạy migrations
   - Run tests
   - Cleanup

2. **Build & Deploy:**
   - Build tất cả services
   - Verify images

**Khi nào dùng:** Khi muốn test toàn bộ stack trước khi deploy

---

## 🔧 Cấu hình cần thiết

### GitHub Secrets (Settings → Secrets and variables → Actions)

**Cho Backend CI/CD:**
- `GITHUB_TOKEN` - Tự động có sẵn, không cần set

**Cho Self-Hosted Deploy:**
- Không cần secrets nếu deploy local
- Nếu deploy remote qua SSH, cần:
  - `SSH_PRIVATE_KEY`
  - `SERVER_HOST`
  - `SERVER_USER`

### GitHub Variables (Settings → Secrets and variables → Actions → Variables)

- `VITE_API_URL` - API URL cho frontend build
- `NEXT_PUBLIC_API_URL` - Next.js public API URL

---

## 📊 Best Practices đã áp dụng

✅ **Concurrency:** Cancel workflow cũ khi có push mới  
✅ **Caching:** Cache npm dependencies và Docker layers  
✅ **Security:** Scan Docker images với Trivy  
✅ **Error Handling:** `continue-on-error` cho các bước không critical  
✅ **Health Checks:** Verify containers/services trước khi tiếp tục  
✅ **Multi-stage Builds:** Optimize Docker image size  
✅ **Environment Variables:** Sử dụng GitHub Variables với fallback  
✅ **Permissions:** Chỉ cấp quyền cần thiết  

---

## 🚀 Next Steps để nâng cao

1. **Monitoring & Notifications:**
   - Thêm Slack/Discord notifications khi deploy
   - Setup error tracking (Sentry)

2. **Advanced Deployment:**
   - Blue-green deployment
   - Rollback strategy
   - Canary deployments

3. **Infrastructure as Code:**
   - Terraform cho AWS/GCP/Azure
   - Kubernetes manifests

4. **Performance:**
   - Load testing với k6
   - Performance budgets

5. **Security:**
   - Dependency scanning (Dependabot)
   - Secret scanning
   - SAST (Static Application Security Testing)

---

## 📚 Tài liệu tham khảo

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [NestJS Deployment](https://docs.nestjs.com/recipes/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 💡 Tips

1. **Debug workflows:** Thêm `- run: |` với nhiều echo statements
2. **Test locally:** Dùng [act](https://github.com/nektos/act) để chạy workflows local
3. **Optimize:** Sử dụng matrix builds cho multi-version testing
4. **Monitor costs:** GitHub Actions có free tier, nhưng self-hosted runners không giới hạn

---

**Tác giả:** Learning DevOps & CI/CD - 06/12/2025  
**Mục tiêu:** Trở thành Fullstack Developer với DevOps skills 🚀

