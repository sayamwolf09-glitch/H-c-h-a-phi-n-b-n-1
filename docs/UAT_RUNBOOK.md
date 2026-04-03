# UAT Runbook - ChemPlay Classroom

## 1) Mục tiêu UAT
- Xác nhận hệ thống vận hành đúng cho 3 vai trò: admin, giáo viên, học sinh.
- Xác nhận 2 chế độ học: Sân chơi tự do và Vào thi.

## 2) Tài khoản kiểm thử
- Admin: `NguyenHang / 2109@Hangyp`
- Giáo viên: `BacNinh / BacNinh@9899`

## 3) Checklist bắt buộc trước buổi học
- [ ] `npm run preflight` pass
- [ ] `npm run prisma:generate` pass
- [ ] `npm run db:seed` pass
- [ ] Truy cập được `/dang-nhap`, `/chon-che-do`, `/bang-xep-hang`

## 4) Kịch bản UAT theo vai trò

### Admin
1. Đăng nhập admin.
2. Vào dashboard admin.
3. Kiểm tra xem lớp, học sinh, ranking có dữ liệu.
4. Tải báo cáo lớp từ `/giao-vien/bao-cao`.

### Giáo viên
1. Đăng nhập giáo viên.
2. Mở trang import học sinh `/giao-vien/import-excel`.
3. Import file mẫu excel.
4. Tạo/kiểm tra quiz và xem danh sách học sinh.

### Học sinh - Sân chơi tự do
1. Vào `/san-choi-tu-do`.
2. Nhập tên + lớp + mã quiz.
3. Trả lời câu hỏi và nộp bài.
4. Kiểm tra thông điệp khích lệ và kết quả.

### Học sinh - Vào thi
1. Vào `/vao-thi`.
2. Nhập tên đúng trong lớp.
3. Hoàn thành bài thi.
4. Kiểm tra giới hạn số lần làm theo cấu hình quiz.

## 5) Tiêu chí pass UAT
- 100% route chính truy cập được.
- Không lỗi 500 trong server logs.
- Import excel và xuất báo cáo hoạt động.
- Ranking cập nhật sau submit.
