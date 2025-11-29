Cách đẩy code lên git:
Bước 1: 
  git status
để kiểm tra các file được thêm, sửa, xóa

Bước 2:
  git add .

Bước 3: 
  git commit -m "Mô tả ngắn những gì bạn đã sửa"

Bước 4:
  git push

-------------------------------------------------------
Một số tình huống thường gặp
✔️ 1. Bạn sửa file nhưng Git không thấy?

Chưa lưu file → nhấn Ctrl + S.

✔️ 2. Báo lỗi “rejected” khi push?

Repository có thay đổi mới → cần pull trước:

git pull
git push

✔️ 3. Push nhầm file như .env, node_modules?

Thêm vào .gitignore, rồi chạy:

git rm --cached backend/.env
git rm -r --cached backend/node_modules
git commit -m "Remove sensitive files"
git push

-------------------------------------------------------
Nếu bị lỗi “non-fast-forward”
Pull về trước:

git pull --rebase

2️⃣ Giải quyết xung đột (nếu có)
3️⃣ Rồi push lại:

git push
