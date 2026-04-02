# Ops Checklist - Production Ready

## A. Security
- [ ] Đổi toàn bộ seed password sau khi deploy.
- [ ] `AUTH_SECRET` đủ mạnh (>= 32 bytes).
- [ ] Bật HTTPS và HSTS qua reverse proxy/CDN.
- [ ] Kiểm tra security headers hoạt động.

## B. Database
- [ ] Bật backup hàng ngày.
- [ ] Test restore mỗi tháng.
- [ ] Chạy `prisma migrate deploy` trong pipeline.

## C. Storage
- [ ] Bucket private + signed URL upload.
- [ ] Giới hạn MIME/size cho image/video/audio.
- [ ] Cấu hình lifecycle xóa file tạm.

## D. Monitoring
- [ ] Gắn APM / Error tracking (ví dụ Sentry).
- [ ] Theo dõi tỉ lệ lỗi API và latency.
- [ ] Cảnh báo khi DB connection cao bất thường.

## E. Vận hành lớp học
- [ ] Test QR code trước giờ học.
- [ ] Chuẩn bị quiz backup nếu mạng yếu.
- [ ] Có người phụ trách hỗ trợ đăng nhập học sinh.
