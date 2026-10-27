# Hệ thống quản lý nhân sự trên nền tảng đám mây

## Thông tin sinh viên
- Họ tên: Nguyễn Hùng Bi
- MSSV: 238284
- Lớp: DH23TIN10

## Mô tả
Hệ thống quản lý nhân sự cho phép xem danh sách, thêm mới, tìm kiếm, cập nhật và xóa hồ sơ nhân viên. Dữ liệu lưu trên MongoDB Atlas, Frontend giao tiếp với Backend qua REST API, toàn bộ được đóng gói bằng Docker và triển khai trên Render.

## Công nghệ sử dụng
- Frontend: React
- Backend: Node.js, Express
- Cơ sở dữ liệu: MongoDB Atlas
- Quản lý mã nguồn: Git, GitHub
- Đóng gói: Docker, Docker Hub
- Triển khai: Render

## Hướng dẫn chạy ở môi trường phát triển
Yêu cầu: Node.js 18 trở lên và một database trên MongoDB Atlas.

**Backend**
```bash
cd backend
cp .env.example .env   # điền MONGODB_URI, PORT, CLIENT_URL
npm install
npm run dev            # chạy tại http://localhost:5000
```

**Frontend**
```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm install
npm run dev            # chạy tại http://localhost:3000
```

## Các đường link
- Link GitHub repository: https://github.com/NguyenHungBi238284/238284_NguyenHungBi
- Link Docker Hub Backend: (cập nhật sau)
- Link Docker Hub Frontend: (cập nhật sau)
- Link Render App: (cập nhật sau)
- Link Render API: (cập nhật sau)
- Link MongoDB Atlas: (cập nhật sau)
