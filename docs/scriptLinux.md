| Nhóm                       | Lệnh                                       | Công dụng                                            |
| -------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Quản lý thư mục & file** | `pwd`                                      | In ra thư mục hiện tại                               |
|                            | `ls -l`                                    | Liệt kê file/folder kèm quyền, owner, size, ngày tạo |
|                            | `cd <path>`                                | Di chuyển đến thư mục `<path>`                       |
|                            | `cd -`                                     | Quay về thư mục trước đó                             |
|                            | `mkdir <folder>`                           | Tạo thư mục mới                                      |
|                            | `rm <file>`                                | Xóa file                                             |
|                            | `rm -rf <folder>`                          | Xóa thư mục và toàn bộ nội dung                      |
|                            | `cp <src> <dst>`                           | Sao chép file/folder                                 |
|                            | `mv <src> <dst>`                           | Di chuyển hoặc đổi tên file/folder                   |
|                            | `cat <file>`                               | Xem nội dung file                                    |
|                            | `tail -f <file>`                           | Xem log file theo thời gian thực                     |
|                            | `echo "text" > file.txt`                   | Ghi text vào file mới hoặc ghi đè file cũ            |
|                            | `chmod`                                    | Thay đổi quyền truy cập file/folder                  |
|                            | `chown`                                    | Thay đổi owner file/folder                           |
| **Node.js / npm / Yarn**   | `node <file.js>`                           | Chạy file JS với Node.js                             |
|                            | `npm install`                              | Cài đặt dependencies từ `package.json`               |
|                            | `npm run <script>`                         | Chạy script định nghĩa trong `package.json`          |
|                            | `npm build`                                | Build project (tuỳ framework)                        |
|                            | `yarn install`                             | Cài đặt dependencies (dùng Yarn)                     |
|                            | `yarn build`                               | Build project (Yarn)                                 |
| **Docker**                 | `docker build -t <name>:<tag> .`           | Build image Docker từ Dockerfile                     |
|                            | `docker run -p <host>:<container> <image>` | Chạy container từ image                              |
|                            | `docker ps`                                | Xem container đang chạy                              |
|                            | `docker stop <container>`                  | Dừng container                                       |
|                            | `docker rm <container>`                    | Xóa container                                        |
|                            | `docker images`                            | Xem image Docker                                     |
|                            | `docker rmi <image>`                       | Xóa image Docker                                     |
| **Hỗ trợ / CI/CD**         | `chmod +x <file.sh>`                       | Cho phép chạy file shell script                      |
|                            | `./<file.sh>`                              | Chạy file shell script                               |
|                            | `crontab -e`                               | Tạo task tự động (cron job)                          |
|                            | `env`                                      | Xem biến môi trường                                  |
|                            | `export VAR=value`                         | Thiết lập biến môi trường                            |
|                            | `curl <url>`                               | Kiểm tra endpoint API                                |
|                            | `wget <url>`                               | Tải file từ URL                                      |
|                            | `tar -czvf file.tar.gz folder/`            | Nén folder thành tar.gz                              |
|                            | `unzip file.zip`                           | Giải nén file zip                                    |
