# Cấu hình Biến Môi Trường trên Vercel

## ⚠️ QUAN TRỌNG
File `.env.local` chỉ dùng cho development local. Vercel **KHÔNG đọc** file này!

Bạn phải cấu hình biến môi trường trực tiếp trên Vercel Dashboard.

## 🚀 Các Bước Cấu Hình

### 1. Đăng nhập Vercel Dashboard
Truy cập: https://vercel.com/dashboard

### 2. Chọn Project của bạn
Tìm project: `1newgiftai` hoặc tên tương tự

### 3. Vào Settings → Environment Variables
- Click vào tab **Settings**
- Chọn **Environment Variables** ở sidebar bên trái

### 4. Thêm các biến sau:

#### Biến bắt buộc:
```
Name: NEXT_PUBLIC_API_URL
Value: https://1newgiftai.onrender.com
Environment: Production, Preview, Development (chọn cả 3)
```

#### Biến tùy chọn (nếu cần):
```
Name: NEXT_PUBLIC_USE_MOCK_AI
Value: false
Environment: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_SITE_URL
Value: https://1newgiftai-fy1ty0ze8-vongocdat22122002-5935s-projects.vercel.app
Environment: Production, Preview, Development
```

### 5. Redeploy Project
Sau khi thêm biến môi trường:
- Vào tab **Deployments**
- Click vào deployment mới nhất
- Click nút **Redeploy** (3 chấm → Redeploy)
- Chọn **Redeploy with existing Build Cache** HOẶC **Redeploy from scratch** (khuyên dùng)

## ✅ Kiểm tra
Sau khi redeploy xong:
1. Mở Console của trình duyệt (F12)
2. Kiểm tra không còn lỗi `localhost:3001`
3. API calls phải gọi đến `https://1newgiftai.onrender.com`

## 🔍 Debug
Nếu vẫn lỗi, kiểm tra:
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```
Giá trị phải là `https://1newgiftai.onrender.com`, không phải `undefined` hay `localhost`.
