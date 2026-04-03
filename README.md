# ChemPlay Classroom - Học Hóa cùng cô Hằng

## Quick Start (chạy được ngay)

### 1) Chuẩn bị môi trường
- Node.js 20+
- Docker (để chạy PostgreSQL local)

### 2) Cấu hình biến môi trường
```bash
cp .env.example .env
```

### 3) Chạy database local
```bash
docker compose up -d postgres
```

### 4) Cài dependencies
```bash
npm install
```

### 5) Prisma generate + migrate + seed
```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

### 6) Chạy ứng dụng
```bash
npm run dev
```
Mở: `http://localhost:3000`

---

## Checklist test nhanh

### A. Health check kỹ thuật
```bash
npm run typecheck
npm run build
```

### B. Kiểm thử đăng nhập
- Admin: `NguyenHang / 2109@Hangyp`
- Giáo viên: `BacNinh / BacNinh@9899`

### C. Kiểm thử luồng học sinh
1. Vào `/chon-che-do`
2. Chạy luồng `/san-choi-tu-do`
3. Chạy luồng `/vao-thi`
4. Hoàn thành bài ở `/lam-bai/[attemptId]`
5. Xem `/ket-qua/[attemptId]` và `/bang-xep-hang`

### D. Kiểm thử quản trị
- Import Excel học sinh: `/giao-vien/import-excel`
- Báo cáo lớp: `/giao-vien/bao-cao`
- QR truy cập: `/qr-code`

---

## Troubleshooting

### Không cài được package (403/registry policy)
Dự án yêu cầu truy cập npm registry công khai. Nếu gặp lỗi 403, kiểm tra:
- Policy mạng nội bộ (proxy/firewall)
- Mirror registry đang khóa một số package
- Quyền truy cập của CI runner

Tạm thời bạn có thể chạy bằng môi trường nội bộ đã cache dependencies hoặc mở quyền npm registry chuẩn.

---

## Tài liệu vận hành bổ sung
- UAT runbook: `docs/UAT_RUNBOOK.md`
- Production ops checklist: `docs/OPS_CHECKLIST.md`
- CI pipeline: `.github/workflows/ci.yml`
- Phase 10 production lock: `docs/PHASE10_PRODUCTION_LOCK.md`

## Kiểm thử nâng cao (Phase 10)
```bash
npm run test:rbac
npm run smoke:e2e
```
