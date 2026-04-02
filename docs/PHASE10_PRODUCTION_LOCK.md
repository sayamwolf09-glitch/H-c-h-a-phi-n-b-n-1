# Phase 10 - Production Lock

## Mục tiêu
- Khóa chất lượng production với 3 trụ cột:
  1. Audit log chuẩn
  2. Kiểm tra RBAC matrix tự động
  3. Smoke E2E nhanh cho route quan trọng

## Thành phần đã thêm
- `lib/services/audit-log.service.ts`: helper ghi activity log theo cơ chế best-effort.
- `tests/rbac-matrix.spec.ts`: kiểm tra nhanh các luật RBAC cốt lõi.
- `scripts/smoke-e2e.mjs`: kiểm tra route public chính với mã trạng thái hợp lệ.

## Lệnh sử dụng
```bash
npm run test:rbac
npm run smoke:e2e
```

> `smoke:e2e` cần app đang chạy (`npm run dev` hoặc `npm run start`).
